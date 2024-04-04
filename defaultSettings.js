export const defaultSettings = {
  interval: 10,
  mainText: "# Header \r\n\r\n Text \r\n\r\n *we start again {{#if calculated.soon}}in a just a bit{{else}}at {{format calculated.endTime 'HH:mm'}}{{/if}}*",
  headerText: "My header",
  footerText: "My footer ({{format calculated.currentTime 'dddd, MMMM Do YYYY, HH:mm:ss'}})",
  titleText: "My title {{#if calculated.soon}}(expired){{else}}({{calculated.diffInMinutes}}){{/if}}",
  minuteRoundUp: true,
  mainColor: "black",
  mainFontSize: "38px",
  urlToRestService: "", // https://api.github.com/repos/mcronberg/whendowestart {{getProperty (getItem calculated.restServiceResponse.items 0) 'archive_url'}}

  mainTextHAlign: "center",
  mainTextVAlign: "center",
  mainTextShadow: "",
  menuColor: "black",

  headerFontSize: "18px",
  headerColor: "black",
  headerTextShadow: "",

  footerFontSize: "12px",
  footerColor: "black",
  footerHAlign: "center",
  footerTextShadow: "",

  backgroundImage: "", //"https://cdn.pixabay.com/photo/2017/04/19/13/03/coffee-2242213_1280.jpg",
  backgroundColor: "white",

  fontFamily: "Verdana",
  culture: "en-US",
  baseUrl: "https://www.whendowestart.com",
  debugBaseUrl: "http://127.0.0.1:5500/",
  debug: true,
};
