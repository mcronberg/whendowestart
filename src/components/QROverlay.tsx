import { QRCodeSVG } from 'qrcode.react'

interface Props {
    url: string
    onClose: () => void
}

export function QROverlay({ url, onClose }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-gray-700 text-sm font-medium">Scan to follow along on your phone</p>
                <QRCodeSVG value={url} size={240} />
                <p className="text-gray-400 text-xs max-w-xs text-center break-all">{url}</p>
                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
