import type { Settings } from './types'

export const defaultSettings: Settings = {
    interval: 20,
    minuteRoundUp: true,

    mainText: '# Pause\n\nWe start at {{starttime}} ({{remaining}} min. left)',
    headerText: 'https://www.whendowestart.com',
    footerText: '[whendowestart.com](https://whendowestart.com)',

    backgroundImage:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
    backgroundColor: '#1e293b',

    color: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
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

    timeoutText: "We're starting now!",
    titleText: '',
    playSound: false,

    culture: 'en-US',
}

export const contentPresets = [
    {
        id: 'pause',
        label: 'Pause — 10 min',
        interval: 10,
        mainText: '# Pause\n\nWe start at {{starttime}} ({{remaining}} min. left)',
        headerText: '',
        footerText: '',
        backgroundImage:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
    },
    {
        id: 'lunch',
        label: 'Lunch — 45 min',
        interval: 45,
        mainText: 'Lunch Break\n\nEnjoy your meal!\n\nWe start at {{starttime}} ({{remaining}} min. left)',
        headerText: '',
        footerText: '',
        backgroundImage:
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
    },
    {
        id: 'exercise',
        label: 'Exercise — 20 min',
        interval: 20,
        mainText: 'Exercise\n\nSee you soon!\n\nWe start at {{starttime}} ({{remaining}} min. left)',
        headerText: '',
        footerText: '',
        backgroundImage:
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80',
    },
]
