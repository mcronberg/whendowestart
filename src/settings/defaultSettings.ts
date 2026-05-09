import type { Settings } from './types'

export const defaultSettings: Settings = {
    interval: 20,
    minuteRoundUp: true,

    mainText: '# This is my main text\n\nWe start at {{starttime}} ({{remaining}} min. left)',
    headerText: 'This is my header',
    footerText: 'This is my footer',

    backgroundImage: '',
    backgroundVideo: 'https://cdn.pixabay.com/video/2023/02/25/152183-802330879_tiny.mp4',
    backgroundColor: '#1e293b',

    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    headerSize: 50,
    footerSize: 40,

    mainColor: '#ffffff',
    headerColor: '#ffffff',
    footerColor: '#ffffff',
    mainFontSize: '',
    headerFontSize: '',
    footerFontSize: '',
    mainFontFamily: '',
    headerFontFamily: '',
    footerFontFamily: '',

    timeoutText: "# This is my timer\n\nWe're starting now!",
    titleText: '',
    playSound: false,

    culture: 'en-US',

    sideNote: 'This is my sidebar\n\nExtra info here.\n\n---\n\nVideo by [bellahu123](https://pixabay.com/users/bellahu123-10783290/) via Pixabay',
}

