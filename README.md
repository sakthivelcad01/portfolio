# Sakthivel's Portfolio

React and Vite portfolio with an animated homepage, an interactive work directory,
and project stories for Cal.com, Rupiece, Formbricks, and Trading Automation.

## Development

Requires Node.js and npm.

```sh
npm ci
npm run dev -- --port 5174
```

Open http://127.0.0.1:5174. The application now lives directly in this repository's root.

## Production Build

```sh
npm run build
npm run preview
```

Build output is written to `dist/`. Configure the hosting service to fall back to
`index.html` for application routes such as `/work` and `/work/02/story`.

## Structure

- `src/`: React components, styles, and animation logic.
- `public/assets/`: project imagery and visual assets.
- `vite.config.js`: Vite configuration.

Project stories identify illustrative scenarios and package documentation where
production measurements or original contribution evidence have not been supplied.
