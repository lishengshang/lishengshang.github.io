简体中文 | [English](./README_EN.md)

> [!NOTE]
> ## 关于本仓库
> 本仓库是 [imsyy/home](https://github.com/imsyy/home) 的 fork 维护版本，原项目已停止维护。
> 在保留原作者成果的基础上，进行了性能优化、代码重构与依赖维护，并持续跟进上游生态升级。
> 如有问题或建议，欢迎提 issue / PR。

<p>
<strong><h2>無名の主页</h2></strong>
简单的小主页，原来的看够了，重新弄了一个
</p>

![無名の主页](/screenshots/main.jpg)

> 主页的 Logo 字体（Pacifico）已经过压缩，仅包含本站 Logo 所需字符，若使用其他字符会回退为默认字体。
> 完整字体已随仓库内置（`public/font/Pacifico-Regular-all.ttf`），将其覆盖 `public/font/Pacifico-Regular.ttf` 即可支持全部字符。

### 🎉 功能

- [x] 载入动画
- [x] 站点简介
- [x] Hitokoto 一言
- [x] 日期及时间
- [x] 时光进度条
- [x] 音乐播放器
- [x] 樱花飘落动画
- [x] 入场动画
- [x] 点击波纹动效
- [x] 移动端适配

### ⚙️ 自动部署

如果遇到构建环境或者打包过程出现错误，则可以采用 `Github Actions` 来进行自动构建

- 在成功 `fork` 仓库后，前往 `Actions` 页面，若您是首次开启，则会出现下面的提示，点击开启

  ![步骤1](/screenshots/step1.jpg)

- 然后在仓库中进行任意修改后均会触发工作流的运行，在工作流完成后，会在下方生成一个可供下载的压缩包，这就是构建出的静态文件，可自行上传至服务器

  ![步骤2](/screenshots/step2.jpg)

### ⚙️ 手动部署

- **安装** [node.js](https://nodejs.org/zh-cn/) **环境**（建议 v22 LTS 或更高）

- 然后在终端中 `cd` 到 项目根目录
- 在 `终端` 中输入：

```bash
# 通过 corepack 启用 pnpm（推荐）
corepack enable

# 安装依赖
pnpm install

# 预览
pnpm dev

# 构建
pnpm build
```

> 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，也可使用 `Vercel` 等托管平台一键导入并自动部署

### ⚙️ Docker 部署

> 安装及配置 Docker 将不在此处说明，请自行解决

```bash
# 构建
docker build -t home .
# 运行
docker run -p 12445:12445 -d home
```

### ⚙️ Vercel 部署

> 其他部署平台大致相同，在此不做说明

1. 点击本仓库右上角的 `Fork`，复制本仓库到你的 `GitHub` 账号
2. 复制 `/.env.example` 文件并重命名为 `/.env`（ 重要 ）
3. 按需修改 `/.env` 文件中的配置
4. 点击 `Deploy`，即可成功部署

### 网站链接

在 `src/assets/siteLinks.json` 中可以自定义网站链接（以指向自己的网站）:

```json
{
  "icon": "Blog",
  "name": "博客",
  "link": "https://blog.imsyy.top/"
},
```

其中 `icon` 网站链接的图标可以在 `src/components/Links.vue` 中添加:

```js
// 可前往 https://www.xicons.org 自行挑选并在此处引入
// 此处引入的是 fa 类型
import {
  Link,
  Blog,
  CompactDisc,
  Cloud,
  Compass,
  Book,
  Fire,
  LaptopCode,
} from "@vicons/fa";

...

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};
```

### 社交链接

在 `src/assets/socialLinks.json` 中可以自定义社交链接。

### 音乐

> 本项目采用了基于 `MetingJS` 的 `Aplayer` 音乐播放器，可实现快速自定义歌单
> \*仅支持 **中国大陆地区**

请在 `.env` 文件中更改歌曲相关参数即可实现自定义歌单列表

```bash
# 歌曲 API 地址（建议自行部署 Meting-API，参考 https://github.com/xizeyoupan/Meting-API#deno-deploy；留空则默认使用公共实例 https://api.injahow.cn/meting/）
VITE_SONG_API = ""
# 歌曲服务器 ( netease-网易云, tencent-qq音乐 )
VITE_SONG_SERVER = "netease"
# 播放类型 ( song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家 )
VITE_SONG_TYPE = "playlist"
# 播放 ID
VITE_SONG_ID = "9379831714"
```

### 字体

现采用 `HarmonyOS Sans` 开源字体，采用字体拆分，提升加载速度

> 字体通过 [B站静态资源 CDN](https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css) 引入，无需鉴权，保持默认配置即可生效

### 网站图标及网站背景

#### 网站背景

可以在 `public/images` 中修改网站背景

如果想要添加更多的本地图片作为网站背景，可以将图片重命名 `background+数字` 的形式，并在 `src/components/Background.vue` 中进行修改：

```js
if (type == 0) {
  // 修改此处 Math.random() 后面的第一个数字为图片的数量
  bgUrl.value = `/images/background${Math.floor(Math.random() * 10 + 1)}.jpg`;
}
```

#### 网站图标

可以在 `public/images/icon` 中修改网站图标。

### 技术栈

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
