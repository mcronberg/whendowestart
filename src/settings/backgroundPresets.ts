export interface BackgroundPreset {
    id: string
    label: string
    value: string   // hex color, image URL or video URL
    type: 'color' | 'image' | 'video'
    credit?: string // shown in settings — add copyright/attribution here
}

export const backgroundPresets: BackgroundPreset[] = [

    // ── Colors ───────────────────────────────────────────────────────────────
    {
        id: 'color-slate',
        label: 'Slate',
        type: 'color',
        value: '#1e293b',
    },
    {
        id: 'color-lightblue',
        label: 'Light blue',
        type: 'color',
        value: '#b3d9f7',
    },
    {
        id: 'color-navy',
        label: 'Navy',
        type: 'color',
        value: '#1a2e4a',
    },
    {
        id: 'color-black',
        label: 'Black',
        type: 'color',
        value: '#000000',
    },
    {
        id: 'color-gray',
        label: 'Gray',
        type: 'color',
        value: '#808080',
    },

    // ── Images ────────────────────────────────────────────────────────────────
    {
        id: 'img-coffee',
        label: 'Coffee',
        type: 'image',
        value: 'https://cdn.pixabay.com/photo/2021/06/28/10/15/coffee-6371149_1280.jpg',
        credit: 'Pixabay https://pixabay.com/da/photos/kaffe-drikke-koffein-drik-kop-6371149/',
    },
        {
        id: 'img-exercise',
        label: 'Exercise',
        type: 'image',
        value: 'https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_960_720.png',
        credit: 'Pixabay https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_960_720.png/',
    },
    {
        id: 'img-lunch',
        label: 'Restaurant',
        type: 'image',
        value: 'https://cdn.pixabay.com/photo/2019/04/28/07/48/mount-horeb-lunch-4162348_1280.jpg',
        credit: 'Pixabay https://pixabay.com/da/photos/bjerget-horeb-frokost-cafe-frokost-4162348/',
    },
    {
        id: 'img-school',
        label: 'School',
        type: 'image',
        value: 'https://cdn.pixabay.com/photo/2017/02/24/02/37/classroom-2093744_1280.jpg',
        credit: 'Pixabay https://pixabay.com/da/photos/klassev%c3%a6relse-skole-uddannelse-2093744/',
    },
    {
        id: 'img-exam',
        label: 'Exam desk',
        type: 'image',
        value: 'https://cdn.pixabay.com/photo/2018/09/04/10/06/man-3653346_1280.jpg',
        credit: 'Pixabay https://pixabay.com/da/photos/mand-m%c3%a6nd-h%c3%a5nd-person-mennesker-3653346/',
    },

    // ── Videos ────────────────────────────────────────────────────────────────
    {
        id: 'video-butterfly',
        label: 'Butterfly',
        type: 'video',
        value: 'https://cdn.pixabay.com/video/2020/04/25/37168-413256668_large.mp4',
        credit: 'https://pixabay.com/da/videos/callimorphe-skildpaddeskal-broget-37168/',
    },
        {
        id: 'video-binary',
        label: 'Binary',
        type: 'video',
        value: 'https://cdn.pixabay.com/video/2023/07/19/172170-846731303_large.mp4',
        credit: 'https://pixabay.com/da/videos/ai-kunstig-kunstig-intelligens-172170/',
    },
    {
        id: 'video-restaurant',
        label: 'Restaurant',
        type: 'video',
        value: 'https://cdn.pixabay.com/video/2017/07/23/10878-226635359_large.mp4',
        credit: 'https://pixabay.com/da/videos/diskussion-restaurant-mennesker-10878/',
    },
    {
        id: 'video-pause',
        label: 'Pause',
        type: 'video',
        value: 'https://cdn.pixabay.com/video/2021/01/28/63257-505964195_large.mp4',
        credit: 'https://pixabay.com/da/videos/h%c3%a6ngek%c3%b8je-ocean-hav-slap-af-63257/',
    },

    
]


