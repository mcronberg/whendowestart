import { marked } from 'marked'
import type { CountdownState } from '../hooks/useCountdown'
import type { Settings } from '../settings/types'

interface Props {
    countdown: CountdownState
    settings: Settings
}

export function MainDisplay({ countdown, settings }: Props) {
    const { minutesLeft, formattedEndTime, expired } = countdown

    // Replace {{starttime}} / {{remaining}} placeholders before markdown parsing
    // {{remaining:b}} = binary, {{remaining:x}} = hex, {{remaining}} = decimal
    const formatRemaining = (fmt: string) => {
        if (fmt === 'b') return '0b' + minutesLeft.toString(2)
        if (fmt === 'x') return '0x' + minutesLeft.toString(16)
        return String(minutesLeft)
    }
    const processText = (text: string) =>
        (text || '')
            .replace(/\{\{remaining(?::([bx]))?\}\}/g, (_, fmt) => formatRemaining(fmt || ''))
            .replace(/\{\{starttime\}\}/g, formattedEndTime)

    const activeMainText = expired ? settings.timeoutText : settings.mainText
    const mainHtml = marked.parse(processText(activeMainText), { async: false }) as string
    const headerHtml = marked.parse(processText(settings.headerText || ''), { async: false }) as string
    const footerHtml = marked.parse(processText(settings.footerText || ''), { async: false }) as string

    const mainFontSize = settings.mainFontSize || '4vw'
    const headerFontSize =
        settings.headerFontSize ||
        `calc(${mainFontSize} * ${settings.headerSize / 100})`
    const footerFontSize =
        settings.footerFontSize ||
        `calc(${mainFontSize} * ${settings.footerSize / 100})`

    const globalStyle = {
        fontFamily: settings.fontFamily,
        color: settings.color || '#ffffff',
    }

    const bgStyle: React.CSSProperties =
        settings.backgroundImage
            ? {
                backgroundImage: `url(${settings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
            : { backgroundColor: settings.backgroundColor }

    return (
        <div
            className="fixed inset-0 flex flex-col overflow-hidden"
            style={{ ...bgStyle, ...globalStyle }}
        >
            {/* Overlay for readability when background image is set */}
            {settings.backgroundImage && (
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            )}

            {/* Header */}
            {settings.headerText && (
                <header
                    className="display-content relative z-10 w-full text-center px-8 py-4"
                    style={{
                        fontSize: headerFontSize,
                        color: settings.headerColor || settings.color,
                        fontFamily: settings.headerFontFamily || settings.fontFamily,
                    }}
                    dangerouslySetInnerHTML={{ __html: headerHtml }}
                />
            )}

            {/* Main */}
            <main
                className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 ${expired ? 'animate-pulse' : ''}`}
                style={{
                    fontSize: mainFontSize,
                    color: settings.mainColor || settings.color,
                    fontFamily: settings.mainFontFamily || settings.fontFamily,
                }}
            >
                <div
                    className="display-content max-w-none w-full"
                    dangerouslySetInnerHTML={{ __html: mainHtml }}
                />
            </main>

            {/* Footer */}
            {settings.footerText && (
                <footer
                    className="display-content relative z-10 w-full text-center px-8 py-4"
                    style={{
                        fontSize: footerFontSize,
                        color: settings.footerColor || settings.color,
                        fontFamily: settings.footerFontFamily || settings.fontFamily,
                    }}
                    dangerouslySetInnerHTML={{ __html: footerHtml }}
                />
            )}
        </div>
    )
}
