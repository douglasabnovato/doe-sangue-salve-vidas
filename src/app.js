/* Aplicação Express do Doe Sangue: página única com cadastro, lista minimizada e tratamento de erros */
const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { validateDonor, BLOOD_TYPES } = require("./lib/donorValidation");

/* Monta o app com o repositório injetado */
function createApp({ donors, trustProxy = false }) {
  const app = express();
  if (trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "style-src": ["'self'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "script-src": ["'self'"],
          "img-src": ["'self'", "data:"],
        },
      },
    })
  );
  app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "1h" }));
  app.use(express.urlencoded({ extended: false, limit: "5kb" }));
  nunjucks.configure(path.join(__dirname, "..", "views"), { express: app, autoescape: true });

  const postLimiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false });

  /* Carrega os dados da página inicial */
  async function pageData(extra = {}) {
    const [latest, byBlood] = await Promise.all([donors.latest(8), donors.countByBlood()]);
    return { latest, byBlood, bloodTypes: BLOOD_TYPES, ...extra };
  }

  app.get("/health", async (req, res, next) => {
    try {
      res.json({ status: "ok", donors: await donors.count() });
    } catch (err) {
      next(err);
    }
  });

  app.get("/", async (req, res, next) => {
    try {
      res.render("index.html", await pageData({ status: req.query.status }));
    } catch (err) {
      next(err);
    }
  });

  app.post("/", postLimiter, async (req, res, next) => {
    try {
      const { value, errors } = validateDonor(req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(422).render("index.html", await pageData({ form: value, errors, openForm: true }));
      }
      const created = await donors.create(value);
      return res.redirect(303, created ? "/?status=ok#doadores" : "/?status=existente#doadores");
    } catch (err) {
      return next(err);
    }
  });

  app.use((req, res) => res.status(404).render("error.html", { status: 404, message: "Página não encontrada." }));

  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    return res.status(503).render("error.html", {
      status: 503,
      message: "O cadastro está indisponível no momento. Tente novamente em alguns minutos.",
    });
  });

  return app;
}

module.exports = { createApp };
/* Fim de app.js */
