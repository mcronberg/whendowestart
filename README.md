# ⏱ When Do We Start?

**The teacher's countdown display** — a fullscreen countdown timer you can put on the projector so your class knows exactly when you're starting again.

🌐 **[whendowestart.com](https://whendowestart.com)**

![Screenshot showing "Pause – We start at 14:30 (20 min. left)" on a coffee background](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80)

## Features

- ⏱ Countdown by minutes, clock time (`14:30`) or 12-hour format (`3pm`)
- 📺 Fullscreen display with background image, custom fonts and colors
- ✏️ Rich text editor for header, main text, footer and timeout message
- 📎 Shareable link and QR code — open the same countdown on any device
- 🔁 Quick presets for common scenarios (pause, lunch, exercise)
- 📱 Installable as a PWA (works offline after first load)
- 🕐 Browser tab shows `⏱ MM:SS` — use it as a hidden background timer
- 🤓 Geek mode: `{{remaining:b}}` for binary, `{{remaining:x}}` for hex countdown

## How to use

1. Open [whendowestart.com](https://whendowestart.com) (or press **Ctrl+S**)
2. Set a timer — e.g. `20` for 20 minutes, `14:30` for a fixed time
3. Edit the countdown text — use `{{starttime}}` and `{{remaining}}` as placeholders
4. Press **Save & start**
5. Go fullscreen with **F11** and point it at the projector

## URL parameters

Settings are encoded in the URL, making it easy to share exact configurations:

```
https://whendowestart.com/?interval=20&mainText=...
```

Use **Copy link** or the **QR code** button to share.

## Development

Built with React 18, Vite 5, TypeScript, Tailwind CSS v3 and TipTap.

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # production build → dist/
```

Deployed automatically to GitHub Pages via GitHub Actions on push to `main`.

## Author

Made by **Michell Cronberg** — teacher, developer and trainer.  
Developed in collaboration with **Claude Sonnet 4.6**.

## License

MIT — free for everyone.


If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
