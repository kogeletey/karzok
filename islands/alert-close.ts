function close_alert() {
  (document.querySelector('div[role="alert"]') as HTMLInputElement).remove();
  localStorage.setItem("alert", "close");
}

(document.querySelector('button[aria-label="close alert"]') as HTMLInputElement)
    .addEventListener("click", close_alert)

if (localStorage.getItem("alert") == "close") {
  (document.querySelector('div[role="alert"]') as HTMLInputElement).remove()
}
