export const defaultSettings = {
  baseUrl: "http://127.0.0.1:5500/",
  culture: "en-US",
  interval: 2,
  minuteRoundUp: true,
  mainText: "# Header \r\n\r\n Text \r\n\r\n *we start again {{#if calculated.soon}}in a just a bit{{else}}at {{format calculated.endTime 'h:mm A'}}{{/if}}*",
  mainColor: "black",
  mainFontSize: "38px",
  titleText: "My title ({{add calculated.diffInMinutes 1}})",
  urlToRestService: "https://api.github.com/repos/mcronberg/whendowestart", // {{getProperty (getItem calculated.restServiceResponse.items 0) 'archive_url'}}

  mainTextHAlign: "center",
  mainTextVAlign: "center",

  menuColor: "black",

  headerFontSize: "18px",
  headerText: "My header (stars: {{calculated.restServiceResponse.stargazers_count}})",
  headerColor: "white",

  footerText: "My footer ({{format calculated.currentTime 'dddd, MMMM Do YYYY, h:mm:ss a'}})",
  footerFontSize: "12px",
  footerColor: "white",
  footerHAlign: "center",

  backgroundImage: "https://cdn.pixabay.com/photo/2017/04/19/13/03/coffee-2242213_1280.jpg",
  backgroundColor: "gray",
  addBlur: false,

  fontFamily: "Verdana",
};
