const settings = {
  baseUrl: "http://127.0.0.1:5500/",
  interval: 1,
  minuteRoundUp: true,
  timeFormat: "hh:mm:ss A",
  durationFormat: "mm:ss",
  row1Text: "Add text to line 1 {endTime}",
  row2Text: "Add text to line 2",
  row3Text: "Add text to line 3",
  row4Text: "{countdownValue} minutes left!",
  titleText: "Start in {countdownValue}",
  timeupText: "Time's up!",

  menuColor: "black",

  headerFontSize: "12px",
  headerText: "When do we start?",
  headerColor: "black",

  footerText: "www.whendowestart.com",
  footerFontSize: "12px",
  footerColor: "black",
  footerHAlign: "center",

  backgroundImage:
    "https://cdn.pixabay.com/photo/2023/01/23/21/11/apple-7739714_1280.jpg",
  backgroundColor: "white",
  addBlur: true,

  fontFamily: "Verdana",

  row1FontSize: "32px",
  row2FontSize: "32px",
  row3FontSize: "32px",
  row4FontSize: "32px",

  row1Color: "black",
  row2Color: "black",
  row3Color: "black",
  row4Color: "black",

  row1VAlign: "center",
  row2VAlign: "center",
  row3VAlign: "center",
  row4VAlign: "center",
  row1HAlign: "center",
  row2HAlign: "center",
  row3HAlign: "center",
  row4HAlign: "center",
};

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
  useSettings();

  const tabs = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const target = document.getElementById(this.getAttribute("data-tab"));

      tabContents.forEach((tc) => {
        tc.classList.remove("active");
      });

      tabs.forEach((t) => {
        t.classList.remove("active");
      });

      target.classList.add("active");
      this.classList.add("active");
    });
  });

  // Optionally, activate the first tab by default
  if (tabs.length > 0) {
    tabs[0].click();
  }

  const settingsDialog = document.querySelector("#settings-dialog");
  const dynamicLink = document.getElementById("dynamicLink");
  const inputs = settingsDialog.querySelectorAll(
    "input[type='text'], input[type='number'], input[type='color']"
  );

  const updateLink = () => {
    const params = new URLSearchParams();
    inputs.forEach((input) => {
      // Only add parameter if input has a value
      if (input.value) {
        params.append(input.name, input.value);
      }
    });
    dynamicLink.href = `${settings.baseUrl}?${params.toString()}&start=1`;
  };

  // Attach the event listener to each input field
  inputs.forEach((input) => input.addEventListener("change", updateLink));

  // Initial update in case there are any preset values
  updateLink();

  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);
    if (input) {
      input.value = settings[key];
    }
  }

  const submitButton = document.querySelector(
    '#settings-form input[type="submit"]'
  );
  // Trigger a click event on the submit button
  submitButton.click();
};

function useSettings() {
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

  document.querySelector(".row1").style.alignItems = settings.row1VAlign;
  document.querySelector(".row2").style.alignItems = settings.row2VAlign;
  document.querySelector(".row3").style.alignItems = settings.row3VAlign;
  document.querySelector(".row4").style.alignItems = settings.row4VAlign;

  document.querySelector(".footer").style.justifyContent =
    settings.footerHAlign;
  document.querySelector(".row1").style.justifyContent = settings.row1HAlign;
  document.querySelector(".row2").style.justifyContent = settings.row2HAlign;
  document.querySelector(".row3").style.justifyContent = settings.row3HAlign;
  document.querySelector(".row4").style.justifyContent = settings.row4HAlign;

  document.querySelector(".row1").style.fontSize = settings.row1FontSize;
  document.querySelector(".row2").style.fontSize = settings.row2FontSize;
  document.querySelector(".row3").style.fontSize = settings.row3FontSize;
  document.querySelector(".row4").style.fontSize = settings.row4FontSize;

  document.querySelector(".row1").style.color = settings.row1Color;
  document.querySelector(".row2").style.color = settings.row2Color;
  document.querySelector(".row3").style.color = settings.row3Color;
  document.querySelector(".row4").style.color = settings.row4Color;

  document.querySelector(".burger-menu-div").style.color = settings.menuColor;
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

function timerTick() {
  const countdown = setInterval(() => {
    if (moment().isAfter(endTime)) {
      clearInterval(countdown);
      document.querySelector(".row4").textContent = settings.timeupText;
      document.title = settings.timeupText;
    } else {
      const diffInMilliseconds = endTime.diff(moment());
      const duration = moment.duration(diffInMilliseconds);
      const diffDate = moment().startOf("day").add(duration);
      const formatted = diffDate.format(settings.durationFormat);
      document.querySelector(".row4 span").textContent =
        settings.row4Text.replace("{countdownValue}", formatted);
      document.title = settings.titleText.replace(
        "{countdownValue}",
        formatted
      );
    }
  }, 1000);
}

const dialog = document.querySelector("#settings-dialog");
const burgerMenu = document.querySelector(".burger-menu");

burgerMenu.addEventListener("click", () => {
  for (let key in settings) {
    let input = document.querySelector(`#settings-form [name="${key}"]`);
    if (input) {
      input.value = settings[key];
    }
  }
  dialog.showModal();
});

document
  .querySelector("#settings-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    for (let key in settings) {
      let input = document.querySelector(`#settings-form [name="${key}"]`);
      if (input) {
        settings[key] = input.value;
      }
    }

    useSettings();
    endTime = findEndTime(settings.interval, true);
    let replace = "";
    if (endTime !== undefined) {
      replace = endTime.format(settings.timeFormat);
    }

    const rowElements = document.querySelectorAll(
      ".row1 span, .row2 span, .row3 span, .row4 span, .burger-menu-div"
    );
    rowElements.forEach((element) => element.classList.remove("blur"));

    document.querySelector(".row1 span").textContent =
      settings.row1Text.replace("{endTime}", replace);
    document.querySelector(".row2 span").textContent =
      settings.row2Text.replace("{endTime}", replace);
    document.querySelector(".row3 span").textContent =
      settings.row3Text.replace("{endTime}", replace);
    document.querySelector("#settings-dialog").close();

    if (settings.addBlur)
      rowElements.forEach((element) => element.classList.add("blur"));

    timerTick();
  });

let endTime;
