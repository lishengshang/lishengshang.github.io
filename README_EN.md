English | [Chinese](./README.md)

> [!NOTE]
> ## About this repository
> This repository is a maintained fork of [imsyy/home](https://github.com/imsyy/home). The original project is no longer maintained.
> Building on the original author's work, this fork focuses on performance optimization, code refactoring and dependency upkeep.
> Issues and PRs are welcome.

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
