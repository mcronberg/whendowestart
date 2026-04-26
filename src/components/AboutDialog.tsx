interface Props {
    onClose: () => void
}

const SCROLL_TEXT =
    'When Do We Start? is a free, open source countdown app for teachers and presenters. ' +
    'Point it at your class, set the timer, and go get your coffee. ☕  ' +
    'No login. No tracking. No ads. No nonsense. Just a big clock telling everyone when to come back.  ' +
    'Built with React, Vite, TypeScript and Tailwind CSS.  ' +
    'Open source — contributions welcome!  ' +
    '— github.com/mcronberg/whendowestart  ' +
    '                    '

export function AboutDialog({ onClose }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <style>{`
        @keyframes wdws-ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .wdws-ticker { animation: wdws-ticker 22s linear infinite; white-space: nowrap; }
      `}</style>

            <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-2xl max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">⏱ When Do We Start?</h2>
                    <p className="text-sm text-gray-400 mt-1">The teacher's best friend</p>
                </div>

                <div className="overflow-hidden rounded-lg bg-gray-50 py-3 border border-gray-200">
                    <div className="wdws-ticker text-sm text-gray-600">
                        {SCROLL_TEXT}
                    </div>
                </div>

                <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>✅ No login required</li>
                    <li>✅ Share a countdown link with students via QR or URL</li>
                    <li>✅ Works on phone, tablet and desktop</li>
                    <li>✅ Free &amp; open source</li>
                </ul>

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
