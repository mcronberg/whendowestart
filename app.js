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
  if (
    settings.urlToRestService !== undefined &&
    settings.urlToRestService !== ""
  ) {
    {
      fetch(settings.urlToRestService)
        .then((response) => response.json())
        .then((data) => {
          settings.calculated.restServiceResponse = data;
          console.log(settings);
        });
    }
  }
  updateUISettings();
  updateUI();
  timerTick();

  // const tabs = document.querySelectorAll(".tab-link");
  // const tabContents = document.querySelectorAll(".tab-content");

  // tabs.forEach((tab) => {
  //   tab.addEventListener("click", function () {
  //     const target = document.getElementById(this.getAttribute("data-tab"));

  //     tabContents.forEach((tc) => {
  //       tc.classList.remove("active");
  //     });

  //     tabs.forEach((t) => {
  //       t.classList.remove("active");
  //     });

  //     target.classList.add("active");
  //     this.classList.add("active");
  //   });
  // });

  // Optionally, activate the first tab by default
  // if (tabs.length > 0) {
  //   tabs[0].click();
  // }

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
  //   '#settings-form input[type="submit"]'
  // );
  // // Trigger a click event on the submit button
  // submitButton.click();
};

function updateUISettings() {
  document.body.style.fontFamily = settings.fontFamily;

  document.querySelector(".background").style.backgroundColor =
    settings.backgroundColor;
  document.querySelector(
    ".background"
  ).style.backgroundImage = `url(${settings.backgroundImage})`;

  document.querySelector(".footerText span").textContent = settings.footerText;
  document.querySelector(".headerText span").textContent = settings.headerText;

  document.querySelector(".footerText").style.fontSize =
    settings.footerFontSize;
  document.querySelector(".headerText").style.fontSize =
    settings.headerFontSize;

  document.querySelector(".footerText").style.color = settings.footerColor;
  document.querySelector(".headerText").style.color = settings.headerColor;

  document.querySelector(".footer").style.justifyContent =
    settings.footerHAlign;

  document.querySelector(".burger-menu-div").style.color = settings.menuColor;
}

function timerTick() {
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
      settings.calculated.endTime = findEndTime(
        settings.interval,
        settings.minuteRoundUp
      );

      settings.calculated.diffInMilliseconds = settings.endTime.diff(moment());
      settings.calculated.diffInMinutes = settings.endTime.diff(
        moment(),
        "minutes"
      );
      settings.calculated.diffInSeconds = settings.endTime.diff(
        moment(),
        "seconds"
      );
      const duration = moment.duration(settings.calculated.diffInMilliseconds);
      const diffDate = moment().startOf("day").add(duration);
      const formatted = diffDate.format(settings.durationFormat);
      settings.calculated.diffFormatted = formatted;

      settings.calculated.mainText = compileTemplate(
        settings.mainText,
        settings
      );
      settings.calculated.titleText = compileTemplate(
        settings.titleText,
        settings
      );

      settings.calculated.headerText = compileTemplate(
        settings.headerText,
        settings
      );

      settings.calculated.footerText = compileTemplate(
        settings.footerText,
        settings
      );

      updateUI();
    }
  }, 1000);
}

function updateUI() {
  document.title = settings.calculated.titleText;
  document.querySelector(".main").innerHTML = settings.calculated.mainText;
  document.querySelector(".headerText").innerHTML =
    settings.calculated.headerText;
  document.querySelector(".footerText").innerHTML =
    settings.calculated.footerText;
}

function numberAsBinaryString(value) {
  return value.toString(2);
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

// const dialog = document.querySelector("#settings-dialog");
// const burgerMenu = document.querySelector(".burger-menu");

// burgerMenu.addEventListener("click", () => {
//   for (let key in settings) {
//     let input = document.querySelector(`#settings-form [name="${key}"]`);
//     if (input) {
//       input.value = settings[key];
//     }
//   }
//   dialog.showModal();
// });

// document
//   .querySelector("#settings-form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     for (let key in settings) {
//       let input = document.querySelector(`#settings-form [name="${key}"]`);
//       if (input) {
//         settings[key] = input.value;
//       }
//     }

//     useSettings();
//     endTime = findEndTime(settings.interval, true);
//     let replace = "";
//     if (endTime !== undefined) {
//       replace = endTime.format(settings.timeFormat);
//     }

//     document.querySelector(".main").innerHTML = settings.mainText.replace(
//       "{endTime}",
//       replace
//     );

//     document.querySelector(".main").innerHTML = compileTemplate(
//       "<div class='blur'><h1 style='color: red;'>{{timeupText}}</h1><div><ul><li>{{dayOfWeek}}</li><li>Item 2</li></ul></div><p>Ends at {endTime}</p></div>",
//       settings
//     );

//     //document.querySelector(".main").textContent = "aasssdfsdfsd";
//     timerTick();
//   });

function compileTemplate(source, data) {
  var template = Handlebars.compile(source);
  return template(data);
}

Handlebars.registerHelper("numberAsBinaryString", function (value) {
  return Number(value).toString(2);
});

Handlebars.registerHelper("numberAsHexadecimalString", function (value) {
  return Number(value).toString(16);
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
