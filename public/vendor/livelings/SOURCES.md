# Livelings 本地脚本

- 来源：[makerjackie/livelings](https://github.com/makerjackie/livelings)
- 固定提交：`3dfe4e60db5f2c9a2b2446a8863c3fd81c09ca8d`
- 引入日期：2026-10-26
- 入口：上游 `src/index.ts`，保留原版引擎、角色与 `<live-ling>` 组件。
- 构建：Vite 6.3.5（本站已有依赖），沿用上游 `vite.lib.config.ts` 的 ES module、ES2022、压缩与单文件配置，增加来源及许可横幅；未修改上游源码。
- 输出：`livelings.js`，由本站 `/vendor/livelings/livelings.js` 提供，无运行时远程依赖。
- SHA-256：`0B31B46CF514088339782EAF81E9226F8560A8405299A39C799C7B86108C0ED7`
- 类型检查：`tsconfig.json` 排除 `public/vendor` 下的第三方构建产物，本站接入组件仍由 `astro check` 检查。
- 代码许可：MIT，完整上游文本见同目录 `LICENSE`，含 bloub 的 MIT 声明。
- 角色许可：CC BY 4.0，完整上游文本见 `LICENSE-CHARACTERS.md`。
- 页脚署名及链接：`Livelings by MakerJackie` → <https://livelings.makerjackie.com>。

升级时先检查固定提交的变更，再使用上游独立库配置重新构建并替换本地文件，同时更新提交、构建版本、哈希与许可文本。
