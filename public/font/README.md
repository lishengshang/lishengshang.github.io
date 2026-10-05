## Logo 字体说明

- `Pacifico-Regular.woff2`：Latin 子集（约 6.7KB），`style.scss` 中 `@font-face` 实际引用的文件
- `UnidreamLED.woff2`：时钟数字字体（Func 组件使用，约 9.1KB）

> 两个 woff2 由原 ttf 子集转换而来（体积约省 64%）。

如需完整字符集，可自行下载 Pacifico 全量字体并转换为 woff2（如 fonttools/pyftsubset 子集化或直接压缩）后替换 `Pacifico-Regular.woff2`（全量 ttf 约 315KB；不建议，子集已覆盖 `li'remio` 等常用 Latin 字符）。
