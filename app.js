import { defaultSettings } from "./defaultSettings.js";

let settings = defaultSettings;

window.onload = function () {

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    settings.debug = true;
  }
  else {
    settings.debug = false;
  }
  if (settings.debug) {
    settings.baseUrl = settings.debugBaseUrl;
  }
  logGroup("onload");

  const urlParams = new URLSearchParams(window.location.search);

  for (let param of urlParams) {
    let key = param[0].toLowerCase();
    let value = param[1];

    for (let settingKey in settings) {
      if (settingKey.toLowerCase() === key) {
        settings[settingKey] = value;
      }
    }
  }
  settings.calculated = {};
  settings.calculated.restServiceResponse = {};
  settings.calculated.endTime = findEndTime(settings.interval, settings.minuteRoundUp);
  if (settings.urlToRestService !== undefined && settings.urlToRestService !== "") {
    console.log("fetching data from rest service " + settings.urlToRestService);
    {
      fetch(settings.urlToRestService)
        .then((response) => response.json())
        .then((data) => {
          settings.calculated.restServiceResponse = data;
          console.log("rest service response", settings.calculated.restServiceResponse);
        });
    }
    
  }



  log(settings);

  updateUISettings();
  updateUI();

  //document.querySelector(".grid-container").style.visibility = "visible";
  logGroupEnd();

  function createForm(settings) {
    const form = document.createElement("form");

    for (let setting in settings) {
      const div = document.createElement("div");
      div.className = "form-group";

      const label = document.createElement("label");
      label.htmlFor = setting;
      label.textContent = `${setting}:`;

      let input;
      if (setting === "calculated" || setting.indexOf("debug") > -1) continue;

      if (setting === "mainText" || setting === "headerText" || setting === "footerText" || setting === "titleText") {
        input = document.createElement("textarea");
      } else {
        input = document.createElement("input");
        input.type = "text";
        input.min = "1";
      }

      input.id = setting;
      input.name = setting;

      div.appendChild(label);
      div.appendChild(input);

      form.appendChild(div);
    }

    return form;
  }

  const form = createForm(settings);
  document.querySelector("#settings-form").appendChild(form);
};

function updateUISettings() {
  logGroup("updateUISettings");
  moment.locale(settings.culture);

  document.body.style.fontFamily = settings.fontFamily;

  document.querySelector(".background").style.backgroundColor = settings.backgroundColor;
  document.querySelector(".background").style.backgroundImage = `url(${settings.backgroundImage})`;

  document.querySelector(".footerText span").innerHTML = settings.footerText;
  document.querySelector(".headerText span").innerHTML = settings.headerText;

  document.querySelector(".footerText").style.fontSize = settings.footerFontSize;
  document.querySelector(".headerText").style.fontSize = settings.headerFontSize;

  document.querySelector(".footerText span").style.color = settings.footerColor;
  document.querySelector(".footerText span").style.margin = "100px";

  document.querySelector(".headerText span").style.color = settings.headerColor;

  document.querySelector(".footer").style.justifyContent = settings.footerHAlign;
  document.querySelector(".footer").style.textShadow = settings.footerTextShadow;
  document.querySelector(".header").style.textShadow = settings.headerTextShadow;

  document.querySelector(".main").style.justifyContent = settings.mainHAlign;
  document.querySelector(".main").style.alignItems = settings.mainVAlign;
  document.querySelector(".main").style.color = settings.mainColor;
  document.querySelector(".main").style.fontSize = settings.mainFontSize;
  document.querySelector(".main").style.textShadow = settings.mainTextShadow;

  document.querySelector(".burger-menu-div").style.color = settings.menuColor;

  logGroupEnd();
}

setInterval(() => {
  settings.calculated.dayOfWeek = moment().format("dddd");
  settings.calculated.year = moment().format("YYYY");
  settings.calculated.month = moment().format("MMMM");
  settings.calculated.day = moment().format("DD");
  settings.calculated.time = moment().format(settings.timeFormat);

  settings.calculated.diffInMilliseconds = settings.calculated.endTime.diff(moment());
  settings.calculated.diffInMinutes = settings.calculated.endTime.diff(moment(), "minutes");
  settings.calculated.diffInSeconds = settings.calculated.endTime.diff(moment(), "seconds");
  const duration = moment.duration(settings.calculated.diffInMilliseconds);
  const diff = moment().startOf("day").add(duration);
  settings.calculated.diff = diff;

  settings.calculated.mainText = marked.parse(compileTemplate(settings.mainText, settings));
  settings.calculated.titleText = compileTemplate(settings.titleText, settings);
  settings.calculated.headerText = marked.parse(compileTemplate(settings.headerText, settings));
  settings.calculated.footerText = marked.parse(compileTemplate(settings.footerText, settings));
  settings.calculated.soon = settings.calculated.diffInSeconds < 5;
  settings.calculated.expired = settings.calculated.diffInSeconds < 1;

  updateUI();
}, 1000);

function updateUI() {
  document.querySelector(".main div").innerHTML = settings.calculated.mainText;
  document.querySelector(".headerText span").innerHTML = settings.calculated.headerText;
  document.querySelector(".footerText span").innerHTML = settings.calculated.footerText;
  document.title = settings.calculated.titleText;
}

function findEndTime(interval, rounded) {
  let t = moment();
  t.add(interval, "minutes");

  if (rounded) {
    let remainder = 5 - (t.minute() % 5);
    if (remainder < 5) {
      t.add(remainder, "minutes");
    }
  }
  t.second(0);
  return t;
}

const dialog = document.querySelector("#settings-dialog");
const burgerMenu = document.querySelector(".burger-menu");
let burgerMenuIsActive = false;

burgerMenu.addEventListener("click", () => {
  logGroup("burgerMenu click");
  burgerMenuIsActive = true;
  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);
    log(input);
    if (input) {
      input.value = settings[key];
    }
  }
  let firstInput = document.querySelector("#settings-form input");
  if (firstInput) {
    firstInput.focus();
    firstInput.select();
  }

  dialog.showModal();
  logGroupEnd();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && burgerMenuIsActive) {
    document.getElementById("submitDialog").click();
  }
});

document.querySelector("#submitDialog").addEventListener("click", function (event) {
  logGroup("submitDialog click");

  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);
    if (input) {
      if (input.value.toLowerCase() === "true") {
        settings[key] = true;
      } else if (input.value.toLowerCase() === "false") {
        settings[key] = false;
      } else {
        settings[key] = input.value;
      }
      if (key === "interval") {
        console.log("interval", isNaN(input.value));
        if (!isNaN(input.value)) {
          settings.calculated.endTime = findEndTime(settings.interval, settings.minuteRoundUp);
        } else {
          // input.value is not a number, try to parse it as a time
          let time = moment(input.value, "HH:mm");
          if (time.isValid()) {
            // input.value is a valid time, create a date object with the current date and the provided time
            let date = moment().set({
              hour: time.get("hour"),
              minute: time.get("minute"),
              second: 0,
            });
            settings.calculated.endTime = date;
          } else {
            input.focus();
            input.select();
            alert("Please enter a valid number or time in the interval field");
            return;
          }
        }
      }
    }
  }

  log(settings);
  updateUISettings();

  document.querySelector("#settings-dialog").close();
  burgerMenuIsActive = false;
  logGroupEnd();
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      document.querySelector(".burger-menu").click();
    }
  });
});

document.querySelector("#link").addEventListener("click", function (event) {
  logGroup("link click");
  let inputs = document.querySelectorAll("#settings-form input, #settings-form textarea");
  const params = new URLSearchParams();
  inputs.forEach((input) => {
    if (input.value) {
      params.append(input.name, input.value);
    }
  });
  let link = `${settings.baseUrl}?${params.toString()}&start=1`;
  burgerMenuIsActive = false;
  document.location.href = link;
  log(link);
  logGroupEnd();
});

function compileTemplate(source, data) {
  var template = Handlebars.compile(source);
  return template(data);
}

function logGroup(label) {
  if (settings.debug) {
    console.groupCollapsed(moment().format("HH:mm:ss") + " " + label);
  }
}

function logGroupEnd() {
  if (settings.debug) {
    console.groupEnd();
  }
}

function log(o) {
  if (settings.debug) {
    console.log(o);
  }
}

Handlebars.registerHelper("numberAsBinaryString", function (value) {
  return Number(value).toString(2);
});

Handlebars.registerHelper("numberAsHexadecimalString", function (value) {
  return "0x" + Number(value).toString(16).toUpperCase();
});

Handlebars.registerHelper("numberAsOctalString", function (value) {
  return Number(value).toString(8);
});

Handlebars.registerHelper("getItem", function (array, index) {
  return array[index];
});

Handlebars.registerHelper("getProperty", function (object, property) {
  return object[property];
});

Handlebars.registerHelper("format", function (value, format) {
  return moment(value).format(format);
});

Handlebars.registerHelper("add", function (n1, n2) {
  return n1 + n2;
});
