export interface Settings {
    // Timer
    interval: number | string // minutes (number) or "HH:mm" (string)
    minuteRoundUp: boolean

    // Content
    mainText: string // Markdown
    headerText: string
    footerText: string

    // Background
    backgroundImage: string
    backgroundColor: string

    // Global styling
    color: string
    fontFamily: string
    headerSize: number // % of main font size
    footerSize: number // % of main font size

    // Per-zone overrides (URL params only, not shown in UI)
    mainColor: string
    headerColor: string
    footerColor: string
    mainFontSize: string
    headerFontSize: string
    footerFontSize: string
    mainFontFamily: string
    headerFontFamily: string
    footerFontFamily: string

    // Timer display
    timeoutText: string
    titleText: string
    playSound: boolean

    // Locale
    culture: string
}
