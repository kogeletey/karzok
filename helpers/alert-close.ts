function close_alert() {
  document.querySelector('div[role="alert"]').remove();
  localStorage.setItem("alert", "close");
}

document
  .querySelector('button[aria-label="close alert"]')
  .addEventListener("click", close_alert);

if (localStorage.getItem("alert") == "close") {
  document.querySelector('div[role="alert"]').remove();
}
