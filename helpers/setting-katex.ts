document.addEventListener("DOMContentLoaded", () => {
//     @ts-ignore
        renderMathInElement(document.body,
          {
          // customised options
          // • auto-render specific keys, e.g.:
          delimiters: [
              {left: '$$', right: '$$', display: true },
              {left: '$', right: '$', display: false}
            ],
          // • rendering keys, e.g.:
          output: 'html',
          throwOnError : false
        });
});
