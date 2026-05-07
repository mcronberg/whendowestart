interface Props {
    onClose: () => void
}

export function AboutDialog({ onClose }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-2xl w-1/2 min-w-80 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">⏱ When Do We Start?</h2>
                    <p className="text-sm text-gray-400 mt-1">The teacher's countdown display</p>
                </div>

                {/* Author */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed">
                    <p>
                        I'm <strong>Michell Cronberg</strong> — teacher, developer and trainer. I've been teaching
                        for many years, and over time I kept refining a small tool I made for myself: a fullscreen
                        countdown that tells the class exactly when we're starting again. This is that tool, now
                        open source and free for everyone.
                    </p>
                    <p className="mt-2 text-gray-500 text-xs">
                        Developed in collaboration with <strong>Claude Sonnet 4.6</strong>.
                    </p>
                </div>

                {/* How to use */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">How to use</h3>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Open <strong>Settings</strong> (burger icon top right, or <kbd className="bg-gray-100 border border-gray-300 rounded px-1 text-xs">Ctrl+S</kbd>)</li>
                        <li>Set a timer — e.g. <em>20</em> for 20 minutes, <em>14:30</em> for a fixed clock time, or <em>3pm</em></li>
                        <li>Edit the text shown during the countdown and when time is up</li>
                        <li>Optionally add a header, footer, background and font</li>
                        <li>Press <strong>Save &amp; start</strong> — the countdown begins immediately</li>
                        <li>Put the browser in fullscreen (<kbd className="bg-gray-100 border border-gray-300 rounded px-1 text-xs">F11</kbd>) and point it at the projector or screen</li>
                    </ol>
                </div>

                {/* Features */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                        <li>🖼️ <strong>Background</strong> — image URL, video URL or solid colour. Free media at Unsplash, Pexels and Pixabay</li>
                        <li>📋 <strong>Side note</strong> — show a panel bottom-right with extra info (e.g. credit, instructions). Toggle with the note icon top-right</li>
                        <li>📱 <strong>QR code</strong> — show a corner QR so participants can follow the countdown on their phone. Toggle with the QR icon top-right. The QR encodes the exact end time so everyone stays in sync</li>
                        <li>🔗 <strong>Copy link</strong> — copies a reusable URL with the current settings (interval, not a fixed time) — handy for reuse next session</li>
                        <li>⏱ When less than 1 minute remains, <code className="bg-gray-100 rounded px-1 text-xs">{'{{remaining}}'}</code> switches from minutes to seconds automatically</li>
                        <li>🚀 <strong>Quick presets</strong> — Pause, Lunch, Exercise and Class Dismissed as a starting point</li>
                    </ul>
                </div>

                {/* Tips */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                        <li>✏️ All text fields support rich formatting — headings, bold, links, lists</li>
                        <li>🤓 Geek mode: use <code className="bg-gray-100 rounded px-1 text-xs">{'{{' + 'remaining:b' + '}}'}</code> for binary or <code className="bg-gray-100 rounded px-1 text-xs">{'{{' + 'remaining:x' + '}}'}</code> for hex countdown</li>
                        <li>⌨️ <kbd className="bg-gray-100 border border-gray-300 rounded px-1 text-xs">Esc</kbd> closes settings &nbsp;·&nbsp; <kbd className="bg-gray-100 border border-gray-300 rounded px-1 text-xs">Ctrl+Enter</kbd> saves</li>
                        <li>🕐 The browser tab always shows the remaining time (MM:SS) — keep this page in a background tab as a <strong>hidden timer</strong></li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <a
                        href="https://github.com/mcronberg/whendowestart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                    >
                        github.com/mcronberg/whendowestart
                    </a>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
