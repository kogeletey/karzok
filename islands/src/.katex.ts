import type RenderMathInElementOptions from "npm:katex@0.16";
import renderMathInElement from "npm:katex@0.16/dist/contrib/auto-render";

const autoRender: RenderMathInElementOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\begin{equation}", right: "\\end{equation}", display: true },
    { left: "\\begin{align}", right: "\\end{align}", display: true },
    { left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
    { left: "\\begin{gather}", right: "\\end{gather}", display: true },
    { left: "\\begin{CD}", right: "\\end{CD}", display: true },
    { left: "\\[", right: "\\]", display: true },
  ],
  output: "mathml",
  throwOnError: false,
};

document.addEventListener("DOMContentLoaded", () => {
  renderMathInElement(document.body, autoRender);
});
