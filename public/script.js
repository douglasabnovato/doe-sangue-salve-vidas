/* Abre e fecha o formulário e valida os campos antes do envio */
(function () {
  const toggle = document.getElementById("toggle-form");
  const section = document.getElementById("cadastro");
  const form = document.querySelector("[data-donor-form]");
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Mostra ou esconde o formulário mantendo aria-expanded coerente */
  function setOpen(open) {
    section.hidden = !open;
    section.classList.toggle("hide", !open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("name").focus();
  }

  /* Aplica a mensagem de erro de um campo */
  function setError(id, message) {
    const field = document.getElementById(id);
    document.getElementById("erro-" + id).textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return message ? field : null;
  }

  /* Valida o formulário e foca o primeiro campo inválido */
  function validate(event) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const invalid = [
      setError("name", name.length < 3 ? "Informe seu nome (3 a 80 caracteres)." : ""),
      setError("email", EMAIL.test(email) ? "" : "Informe um e-mail válido."),
      setError("blood", document.getElementById("blood").value ? "" : "Escolha um tipo sanguíneo da lista."),
      setError("consent", document.getElementById("consent").checked ? "" : "Para entrar na lista, autorize o uso dos seus dados."),
    ].filter(Boolean);
    if (invalid.length) {
      event.preventDefault();
      invalid[0].focus();
    }
  }

  toggle.addEventListener("click", function () { setOpen(section.hidden); });
  form.addEventListener("submit", validate);
})();
/* Fim de script.js */
