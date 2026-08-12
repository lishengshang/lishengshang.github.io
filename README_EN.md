English | [Chinese](./README.md)

> [!NOTE]
> ## About this repository
> This repository is a maintained fork of [imsyy/home](https://github.com/imsyy/home). The original project is no longer maintained.
> Building on the original author's work, this fork focuses on performance optimization, code refactoring and dependency upkeep.
> Issues and PRs are welcome.
>
> ### Maintenance & deployment architecture
> - This repository is the single source of truth for development; all code changes happen here.
> - The author's live site [lishengshang.github.io](https://lishengshang.github.io/) is auto-built and deployed by CI (see `.github/workflows/dispatch.yml`) — push once, deployed automatically.
> - Fork users are not affected by this mechanism; see [Quick start for fork users](#quick-start-for-fork-users) below.

### AI Agent collaboration

This repository supports collaboration across multiple AI Agents. The entry point is [`AGENTS.md`](./AGENTS.md); machine-readable rules, architecture boundaries, workflow and ADR templates are in [`docs/ai/`](./docs/ai/). Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before submitting changes.

<p>
<strong><h2>Homepage</h2></strong>
Simple little homepage, had enough of the original one and made a new one
</p>

![Homepage](/screenshots/main.jpg)

> The logo font (Pacifico) on the home page has been compressed to only include the characters used by the logo; other characters will fall back to the default font.
> The full font is bundled in the repository (`public/font/Pacifico-Regular-all.ttf`). Overwrite `public/font/Pacifico-Regular.ttf` with it to support all characters.

### Features

- [x] Loading animation
- [x] Site description
- [x] Hitokoto
- [x] Date and time
- [x] Time progress bar
- [x] Music player
- [x] Sakura falling animation
- [x] Entrance animation
- [x] Click ripple effect
- [x] Mobile adaptation

### 🚀 Quick start for fork users

This repository is free to fork, modify and reuse. Shortest path:

1. `Fork` this repository to your GitHub account
2. Copy `/.env.example` to `/.env` and update it with **your** site info (site name, site URL, playlist, etc.)
3. Edit `src/assets/siteLinks.json` (site link cards) and `src/assets/socialLinks.json` (social links)
4. Deploy to your own GitHub Pages / Vercel / any static hosting (see deployment sections below)

> [!WARNING]
> **Delete `.github/workflows/dispatch.yml`** before deploying — it is only used by the author to auto-sync this repo to their personal site (it relies on a `PUBLISH_TOKEN` secret). It will not work on forks and will leave a red failed-run badge.

> [!TIP]
> All personalization is done via `/.env` and the two JSON files — no source code changes required. The weather feature has been removed; no AMap key needed.

### Deployment

- **Install** [node.js](https://nodejs.org/en/) **environment** (v22 LTS or higher recommended)

- Then `cd` to the project root directory in the terminal
- In the `terminal` type:

```bash
# Enable pnpm via corepack (recommended)
corepack enable

# Install the dependencies
pnpm install

# Preview
pnpm dev

# Build
pnpm build
```

> Once the build is complete, the files in the `dist` folder can be uploaded to the server or imported and automatically deployed with one click using a hosting platform such as `Vercel`.

### Music

> This project uses the `Aplayer` music player based on `MetingJS` for quick song list customization
> \*Only supported in **Mainland China**

Please change the song related parameters in the `.env` file to customize the song list

```bash
# Songs API address (deploy your own Meting-API service, see https://github.com/xizeyoupan/Meting-API#deno-deploy; leave empty to use the public instance https://api.injahow.cn/meting/)
VITE_SONG_API = ""
# Song server ( netease-netease, tencent-qq music )
VITE_SONG_SERVER = "netease"
# Playback type ( song-song, playlist-playlist, album-album, search-search, artist-artist )
VITE_SONG_TYPE = "playlist"
# Playback ID
VITE_SONG_ID = "9379831714"
```

### Fonts

Now using `HarmonyOS Sans` open source font, using font splitting to improve loading speed

> The font is loaded from the [Bilibili static CDN](https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css) with no authentication required. The default config works out of the box.

### Technology Stack

- [Vue](https://cn.vuejs.org/)
- [Vite](https://cn.vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [IconPark](https://iconpark.oceanengine.com/official)
- [xicons](https://xicons.org/)
- [Aplayer](https://aplayer.js.org/)

### API

- [韩小韩 WebAPI 接口](https://api.vvhan.com/)
- [搏天 API](https://api.btstu.cn/doc/sjbz.php)
- [Hitokoto 一言](https://hitokoto.cn/)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=lishengshang/homepage&type=Date)](https://star-history.com/#lishengshang/homepage&Date)
