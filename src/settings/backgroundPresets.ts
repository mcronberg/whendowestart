export interface BackgroundPreset {
    id: string
    label: string
    value: string   // hex color, image URL or video URL
    type: 'color' | 'image' | 'video'
    credit?: string // shown in settings — add copyright/attribution here
}
