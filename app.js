import { defaultSettings } from "./defaultSettings.js";

let settings = defaultSettings;

window.onload = function () {
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
  settings.endTime = findEndTime(settings.interval, settings.minuteRoundUp);
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
  updateUISettings();
  updateUI();
  timerTick();
};
// const settingsDialog = document.querySelector("#settings-dialog");
// const dynamicLink = document.getElementById("dynamicLink");
// const inputs = settingsDialog.querySelectorAll(
//   "input[type='text'], input[type='number'], input[type='color']"
// );

// const updateLink = () => {
//   const params = new URLSearchParams();
//   inputs.forEach((input) => {
//     // Only add parameter if input has a value
//     if (input.value) {
//       params.append(input.name, input.value);
//     }
//   });
//   dynamicLink.href = `${settings.baseUrl}?${params.toString()}&start=1`;
// };

// // Attach the event listener to each input field
// inputs.forEach((input) => input.addEventListener("change", updateLink));

// // Initial update in case there are any preset values
// updateLink();

// for (let key in settings) {
//   let input = document.querySelector(`#settings-form [name="${key}"]`);
//   if (input) {
//     input.value = settings[key];
//   }
// }

// const submitButton = document.querySelector(
//   '#settings-form button[type="submit"]'
// );
// submitButton.click();

function updateUISettings() {
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

  document.querySelector(".main").style.justifyContent = settings.mainHAlign;
  document.querySelector(".main").style.alignItems = settings.mainVAlign;
  document.querySelector(".main").style.color = settings.mainColor;
  document.querySelector(".main").style.fontSize = settings.mainFontSize;

  document.querySelector(".burger-menu-div").style.color = settings.menuColor;

  if (settings.addBlur) {
    document.querySelector(".main div").classList.add("blur");
  }
}

function timerTick() {
  let visible = false;
  const countdown = setInterval(() => {
    if (moment().isAfter(settings.endTime)) {
      clearInterval(countdown);
      settings.timeupTextValue = settings.timeupText;
    } else {
      settings.calculated.currentTime = moment();
      settings.calculated.dayOfWeek = moment().format("dddd");
      settings.calculated.year = moment().format("YYYY");
      settings.calculated.month = moment().format("MMMM");
      settings.calculated.day = moment().format("DD");
      settings.calculated.time = moment().format(settings.timeFormat);
      settings.calculated.endTime = findEndTime(settings.interval, settings.minuteRoundUp);

      settings.calculated.diffInMilliseconds = settings.endTime.diff(moment());
      settings.calculated.diffInMinutes = settings.endTime.diff(moment(), "minutes");
      settings.calculated.diffInSeconds = settings.endTime.diff(moment(), "seconds");
      const duration = moment.duration(settings.calculated.diffInMilliseconds);
      const diff = moment().startOf("day").add(duration);
      settings.calculated.diff = diff;

      settings.calculated.mainText = marked.parse(compileTemplate(settings.mainText, settings));
      settings.calculated.titleText = compileTemplate(settings.titleText, settings);
      settings.calculated.headerText = marked.parse(compileTemplate(settings.headerText, settings));
      settings.calculated.footerText = marked.parse(compileTemplate(settings.footerText, settings));
      settings.calculated.soon = settings.calculated.diffInMinutes < 1;
      settings.calculated.expired = settings.calculated.diffInSeconds < 2;

      updateUI();

      if (!visible) {
        document.querySelector(".grid-container").style.visibility = "visible";
        visible = true;
      }
    }
  }, 1000);
}

function updateUI() {
  document.title = settings.calculated.titleText;
  document.querySelector(".main div").innerHTML = settings.calculated.mainText;
  document.querySelector(".headerText span").innerHTML = settings.calculated.headerText;
  document.querySelector(".footerText span").innerHTML = settings.calculated.footerText;
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

burgerMenu.addEventListener("click", () => {
  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);

    if (input) {
      if (input.type === "checkbox") {
        input.checked = settings[key];
      } else {
        input.value = settings[key];
      }
    }
  }

  dialog.showModal();
});
document.querySelector("#settings-form").addEventListener("submit", function (event) {
  event.preventDefault();

  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);
    if (input) {
      if (input.type === "checkbox") {
        settings[key] = input.checked;
      } else if (input.type === "textarea") {
        settings[key] = input.value;
      } else {
        settings[key] = input.value;
      }
    }
  }

  updateUISettings();
  timerTick();
  document.querySelector("#settings-dialog").close();
});

function compileTemplate(source, data) {
  var template = Handlebars.compile(source);
  return template(data);
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
