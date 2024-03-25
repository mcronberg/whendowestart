export const defaultSettings = {
  baseUrl: "http://127.0.0.1:5500/",
  interval: 10,
  minuteRoundUp: true,
  urlToRestService: "", // "https://api.github.com/search/repositories?q=whendowestart" {{getProperty (getItem calculated.restServiceResponse.items 0) 'archive_url'}}
  timeFormat: "hh:mm:ss A",
  durationFormat: "mm:ss",
  mainText:
    "We will start in {{format calculated.endTime 'HH:mm:ss'}} ({{numberAsBinaryString calculated.diffInMinutes}}) --  -- {{calculated.diffFormatted}}",
  timeupText: "Time's up!",

  titleText: "Start in {{numberAsBinaryString calculated.diffInSeconds}}",

  menuColor: "black",

  headerFontSize: "12px",
  headerText: "When do we start? {{calculated.dayOfWeek}}",
  headerColor: "black",

  footerText: "www.whendowestart.com {{calculated.dayOfWeek}}",
  footerFontSize: "12px",
  footerColor: "black",
  footerHAlign: "center",

  backgroundImage: "",
  backgroundColor: "white",
  addBlur: true,

  fontFamily: "Verdana",

  mainTextAlign: "center",
};
