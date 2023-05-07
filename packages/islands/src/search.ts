let suggestions: HTMLElement = document.querySelector("div.items");
let body: HTMLElement =
  document.querySelector("main") || document.querySelector("section");
let userinput = document.querySelector("input.search");

const btn_clear = document.querySelector("form button.clear");

function clear_search() {
  userinput.value = "";
  for (let i of [suggestions, btn_clear]) {
    i.style.display = "none";
  }
  userinput.blur();
  if (window.matchMedia("(max-width: 1000px)").matches) {
    document.querySelector("header nav form").style.display = "none";
    document.querySelectorAll("header ul").forEach((p) => {
      p.style.display = "inherit";
    });
  }
}

btn_clear.addEventListener("click", clear_search);

// in page results when press enter or click search icon from search box
function close_search() {
  document.getElementById("close-search")!.onclick = function () {
    location.reload();
  };
}

function mobile_open_search() {
  document.querySelectorAll("header ul").forEach((p) => {
    p.style.display = "none";
  });
  document.querySelector<HTMLInputElement>("header nav form")!.style.display = "flex";
  userinput.focus();
}

document
  .querySelector("button.search")
  .addEventListener("click", mobile_open_search);

function search() {
  let results_clone = suggestions.cloneNode(true);

  let main: HTMLElement = document.createElement("main");
  main.classList.add("full-screen");

  const close_button: string =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z" fill="currentColor"></path></svg>';

  let button = document.createElement("button");
  button.id = "close-search";

  button.innerHTML = close_button;

  let n = new Set([button, results_clone]);

  for (let i of n) {
    main.appendChild(i);
  }

  if (!document.querySelector("main")) {
    if (document.querySelector("div.welcome")) {
      document.querySelector("div.welcome").remove();
    }
    document.querySelector("section").replaceWith(main);
  } else {
    document.querySelector("main").replaceWith(main);
  }

  suggestions.innerHTML = "";
  close_search();
  return false;
}

window.onload = function () {
  document.body.contains(document.go_search) &&
    (document.go_search.onsubmit = function () {
      return search();
    });
};

function inputFocus(e) {
  if (e.key === "/" && document.activeElement.tagName != "input") {
    e.preventDefault();
    userinput.focus();
  } else if (e.key == "Escape") {
    clear_search();
  }
  btn_clear.style.display = "block";
}

function suggestionFocus(e) {
  const focusableSuggestions = suggestions.querySelectorAll("a");
  if (focusableSuggestions.length == 0 || userinput.style.display == "none") {
    return;
  }

  const focusable = [...focusableSuggestions];
  const index = focusable.indexOf(document.activeElement);

  let nextIndex = 0;

  if (e.keyCode === 38) {
    e.preventDefault();
    nextIndex = index > 0 ? index - 1 : 0;
    focusableSuggestions[nextIndex].focus();
  } else if (e.keyCode === 40) {
    e.preventDefault();
    nextIndex = index + 1 < focusable.length ? index + 1 : index;
    focusableSuggestions[nextIndex].focus();
  }
}

document.addEventListener("keydown", inputFocus);
document.addEventListener("keydown", suggestionFocus);

// Get substring by bytes
// If using JavaScript inline substring method, it will return error codes
// Source: https://www.52pojie.cn/thread-1059814-1-1.html
function substringByByte(str, maxLength) {
  let result = "";
  let flag = false;
  let len = 0;
  let length = 0;
  let length2 = 0;
  for (let i = 0; i < str.length; i++) {
    let code = str.codePointAt(i).toString(16);
    if (code.length > 4) {
      i++;
      if (i + 1 < str.length) {
        flag = str.codePointAt(i + 1).toString(16) == "200d";
      }
    }
    if (flag) {
      len += getByteByHex(code);
      if (i == str.length - 1) {
        length += len;
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
        } else {
          break;
        }
      }
    } else {
      if (len != 0) {
        length += len;
        length += getByteByHex(code);
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
          length2 = i + 1;
        } else {
          break;
        }
        len = 0;
        continue;
      }
      length += getByteByHex(code);
      if (length <= maxLength) {
        if (code.length <= 4) {
          result += str[i];
        } else {
          result += str[i - 1] + str[i];
        }
        length2 = i + 1;
      } else {
        break;
      }
    }
  }
  return result;
}

// Get the string bytes from binary
function getByteByBinary(binaryCode) {
  // Binary system, starts with `0b` in ES6
  // Octal number system, starts with `0` in ES5 and starts with `0o` in ES6
  // Hexadecimal, starts with `0x` in both ES5 and ES6
  let byteLengthDatas = [0, 1, 2, 3, 4];
  let len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
  return len;
}

// Get the string bytes from hexadecimal
function getByteByHex(hexCode) {
  return getByteByBinary(parseInt(hexCode, 16).toString(2));
}

/*
Source:
  - https://github.com/nextapps-de/flexsearch#index-documents-field-search
  - https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html
  - http://elasticlunr.com/
  - https://github.com/getzola/zola/blob/master/docs/static/search.js
  - https://github.com/aaranxu/adidoks/blob/main/static/js/search.js
*/
(function () {
  let index = elasticlunr.Index.load(window.searchIndex);
  userinput.addEventListener("input", show_results, true);
  suggestions.addEventListener("click", accept_suggestion, true);
  // if (userinput.value != '') {
  //}

  function show_results() {
    let value = this.value.trim();
    let options = {
      bool: "OR",
      fields: {
        title: { boost: 2 },
        body: { boost: 1 },
      },
    };
    let results = index.search(value, options);

    let entry,
      childs = suggestions.childNodes;
    let i = 0,
      len = results.length;
    let items = value.split(/\s+/);
    suggestions.style.display = "block";

    results.forEach(function (page) {
      if (page.doc.body !== "") {
        entry = document.createElement("div");

        entry.innerHTML = "<a href><span></span><span></span></a>";

        (a = entry.querySelector("a")),
          (t = entry.querySelector("span:first-child")),
          (d = entry.querySelector("span:nth-child(2)"));
        a.href = page.ref;
        t.textContent = page.doc.title;
        d.innerHTML = makeTeaser(page.doc.body, items);

        suggestions.appendChild(entry);
      }
    });

    while (childs.length > len) {
      suggestions.removeChild(childs[i]);
    }
  }

  function accept_suggestion() {
    while (suggestions.lastChild) {
      suggestions.removeChild(suggestions.lastChild);
    }

    return false;
  }

  // Taken from mdbook
  // The strategy is as follows:
  // First, assign a value to each word in the document:
  //  Words that correspond to search terms (stemmer aware): 40
  //  Normal words: 2
  //  First word in a sentence: 8
  // Then use a sliding window with a constant number of words and count the
  // sum of the values of the words within the window. Then use the window that got the
  // maximum sum. If there are multiple maximas, then get the last one.
  // Enclose the terms in <b>.
  function makeTeaser(body, terms) {
    let TERM_WEIGHT = 40;
    let NORMAL_WORD_WEIGHT = 2;
    let FIRST_WORD_WEIGHT = 8;
    let TEASER_MAX_WORDS = 30;

    let stemmedTerms = terms.map(function (w) {
      return elasticlunr.stemmer(w.toLowerCase());
    });
    let termFound = false;
    let index = 0;
    let weighted = []; // contains elements of ["word", weight, index_in_document]

    // split in sentences, then words
    let sentences = body.toLowerCase().split(". ");
    for (let i in sentences) {
      let words = sentences[i].split(/[\s\n]/);
      let value = FIRST_WORD_WEIGHT;
      for (let j in words) {
        let word = words[j];

        if (word.length > 0) {
          for (let k in stemmedTerms) {
            if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
              value = TERM_WEIGHT;
              termFound = true;
            }
          }
          weighted.push([word, value, index]);
          value = NORMAL_WORD_WEIGHT;
        }

        index += word.length;
        index += 1; // ' ' or '.' if last word in sentence
      }

      index += 1; // because we split at a two-char boundary '. '
    }

    if (weighted.length === 0) {
      if (body.length !== undefined && body.length > TEASER_MAX_WORDS * 10) {
        return body.substring(0, TEASER_MAX_WORDS * 10) + "...";
      } else {
        return body;
      }
    }

    let windowWeights = [];
    let windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
    // We add a window with all the weights first
    let curSum = 0;
    for (let i = 0; i < windowSize; i++) {
      curSum += weighted[i][1];
    }
    windowWeights.push(curSum);

    for (let i = 0; i < weighted.length - windowSize; i++) {
      curSum -= weighted[i][1];
      curSum += weighted[i + windowSize][1];
      windowWeights.push(curSum);
    }

    // If we didn't find the term, just pick the first window
    let maxSumIndex = 0;
    if (termFound) {
      let maxFound = 0;
      // backwards
      for (let i = windowWeights.length - 1; i >= 0; i--) {
        if (windowWeights[i] > maxFound) {
          maxFound = windowWeights[i];
          maxSumIndex = i;
        }
      }
    }

    let teaser = [];
    let startIndex = weighted[maxSumIndex][2];
    for (let i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
      let word = weighted[i];
      if (startIndex < word[2]) {
        // missing text from index to start of `word`
        teaser.push(body.substring(startIndex, word[2]));
        startIndex = word[2];
      }

      // add <em/> around search terms
      if (word[1] === TERM_WEIGHT) {
        teaser.push("<b>");
      }

      startIndex = word[2] + word[0].length;
      // Check the string is ascii characters or not
      let re = /^[\x00-\xff]+$/;
      if (
        word[1] !== TERM_WEIGHT &&
        word[0].length >= 12 &&
        !re.test(word[0])
      ) {
        // If the string's length is too long, it maybe a Chinese/Japance/Korean article
        // if using substring method directly, it may occur error codes on emoji chars
        let strBefor = body.substring(word[2], startIndex);
        let strAfter = substringByByte(strBefor, 12);
        teaser.push(strAfter);
      } else {
        teaser.push(body.substring(word[2], startIndex));
      }

      if (word[1] === TERM_WEIGHT) {
        teaser.push("</b>");
      }
    }
    teaser.push("…");
    return teaser.join("");
  }
  document.body.contains(document.go_search) &&
    (document.go_search.onsubmit = function () {
      return search();
    });
})();
