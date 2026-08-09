# lishengshang.github.io

本站是 [lishengshang/homepage](https://github.com/lishengshang/homepage) 的**自动部署仓库**，不包含站点源码。

- **站点代码**：请前往 [lishengshang/homepage](https://github.com/lishengshang/homepage)（唯一维护仓库）
- **部署方式**：`.github/workflows/build.yml` 监听 homepage 仓库的 `repository_dispatch` 事件，自动拉取其 `main` 分支最新代码，构建后部署到 GitHub Pages
- **注意**：请勿在本仓库直接修改站点代码，任何改动请提交到 homepage 仓库，部署会自动同步
