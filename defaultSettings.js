export const defaultSettings = {
  baseUrl: "http://127.0.0.1:5500/",
  culture: "en-US",
  interval: 10,
  minuteRoundUp: true,
  urlToRestService: "", // "https://api.github.com/search/repositories?q=whendowestart" {{getProperty (getItem calculated.restServiceResponse.items 0) 'archive_url'}}

  mainText: "<h1>My text</h1><p>My paragraph!</p>",

  mainTextHAlign: "center",
  mainTextVAlign: "center",

  timeupText: "Time's up!",

  titleText: "My title",

  menuColor: "black",

  headerFontSize: "12px",
  headerText: "My header {{calculated.dayOfWeek}}",
  headerColor: "black",

  footerText: "My footer",
  footerFontSize: "12px",
  footerColor: "black",
  footerHAlign: "center",

  backgroundImage: "",
  backgroundColor: "white",
  addBlur: false,

  fontFamily: "Verdana",
};
