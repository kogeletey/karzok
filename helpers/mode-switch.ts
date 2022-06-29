function set_theme(mode:string) {
    if (mode != "light" && mode != "black" && mode != "auto") {
        mode = "auto"
        console.log(`invalid theme mode: ${mode}`)
    }
    document.body.dataset.theme = mode
    localStorage.setItem("theme", mode)
//    console.log(`change to ${mode} mode`)
}

function get_theme() {

const current_theme = localStorage.getItem("theme") || "auto"
const prefers_dark = window.matchMedia("(prefers-color-scheme: dark)").matches

if (prefers_dark) {
    if (current_theme == "auto") {
        set_theme("light")
    } else if (current_theme == "light") {
        set_theme("black")
    } else {
        set_theme("auto")
    }
  } else {
    if (current_theme == "auto") {
        set_theme("black")
    } else if (current_theme == "black") {
        set_theme("light")
    } else {
        set_theme("auto")
    }
  }
}

const btn = document.getElementsByClassName("toggle")
  Array.from(btn).forEach((button) => {
        button.addEventListener("click", get_theme)
})

