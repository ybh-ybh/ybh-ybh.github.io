import { currentLocale } from "./language";

// 同步导航开关、系统偏好与本地主题选择，并返回局部清理方法。
export function initTheme(): () => void {
  // 与头部首屏初始化共用存储键，仅保存主题名称。
  const storageKey = "portfolio-theme";
  // 页面根节点提供所有组件共用的配色状态。
  const root = document.documentElement;
  // 桌面和手机共用的导航开关。
  const switches = document.querySelectorAll<HTMLInputElement>("[data-theme-toggle]");
  // 无手动选择时跟随操作系统明暗偏好。
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  // 减少动态效果时跳过整屏扩散，直接应用主题。
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // 生命周期控制器保证热更新不会重复绑定监听。
  const controller = new AbortController();
  // 保存本模块的过渡对象，连续操作时取消旧动画而不锁定按钮。
  let transition: ViewTransition | null = null;
  // 过渡被跳过仍可能执行回调，用序号阻止旧请求覆盖新状态。
  let revision = 0;
  // 存储不可用时，仍在本页记住用户的手动选择。
  let preference: string | null = null;
  try { preference = localStorage.getItem(storageKey); } catch { /* 隐私模式下仍可切换。 */ }

  // 验证存储值，忽略旧值或无效内容。
  const validTheme = (value: string | null): value is "light" | "dark" => value === "light" || value === "dark";
  if (!validTheme(preference)) preference = null;

  // 应用颜色并同步原生开关，布局和滚动位置保持不变。
  const applyTheme = () => {
    // 明确选择优先，否则使用系统设置。
    const theme = preference ?? (system.matches ? "dark" : "light");
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c1220" : "#ffffff");
    switches.forEach((input) => {
      input.checked = theme === "light";
      input.setAttribute("aria-label", currentLocale() === "en" ? "Light theme" : "浅色主题");
      input.closest("label")?.setAttribute("title", currentLocale() === "en" ? (theme === "light" ? "Switch to dark theme" : "Switch to light theme") : (theme === "light" ? "切换到深色主题" : "切换到浅色主题"));
    });
  };

  // 仅移除主题扩散自己的定位变量和临时样式标记。
  const clearReveal = () => {
    delete root.dataset.themeReveal;
    root.style.removeProperty("--theme-reveal-x");
    root.style.removeProperty("--theme-reveal-y");
    root.style.removeProperty("--theme-reveal-radius");
  };

  // 只有手动操作从按钮中心扩散，其余主题同步直接生效。
  const showTheme = (input?: HTMLInputElement) => {
    // 每个请求拥有独立版本，取消旧请求不会误改新主题。
    const currentRevision = ++revision;
    transition?.skipTransition();
    transition = null;
    clearReveal();
    // 同主题不重复动画；旧浏览器与减少动态效果均走静态兜底。
    const theme = preference ?? (system.matches ? "dark" : "light");
    if (!input || reducedMotion.matches || typeof document.startViewTransition !== "function"
      || !CSS.supports("clip-path", "circle(0px at 0px 0px)") || root.dataset.theme === theme) {
      applyTheme();
      return;
    }

    // 始终以可见按钮中心为起点，鼠标、触屏和键盘使用相同路径。
    const bounds = (input.closest("label") ?? input).getBoundingClientRect();
    // 限制起点在视口内，避免窗口缩放过程中出现无效裁切。
    const x = Math.max(0, Math.min(window.innerWidth, bounds.left + bounds.width / 2));
    // 使用视口坐标，滚动到页面任意位置都从固定导航按钮出发。
    const y = Math.max(0, Math.min(window.innerHeight, bounds.top + bounds.height / 2));
    // 半径覆盖最远角落，并留出少量余量避免边缘残留旧主题。
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 4;
    root.style.setProperty("--theme-reveal-x", `${x}px`);
    root.style.setProperty("--theme-reveal-y", `${y}px`);
    root.style.setProperty("--theme-reveal-radius", `${radius}px`);
    root.dataset.themeReveal = "true";

    try {
      // 浏览器保留旧页面快照，让新主题整页沿圆形裁切向外显现。
      const currentTransition = document.startViewTransition(() => {
        if (currentRevision === revision) applyTheme();
      });
      transition = currentTransition;
      // 连点、页面隐藏或浏览器主动跳过动画时，ready 拒绝属于正常情况。
      void currentTransition.ready.catch(() => {});
      void currentTransition.finished.catch(() => {}).finally(() => {
        if (transition !== currentTransition) return;
        transition = null;
        clearReveal();
      });
    } catch {
      clearReveal();
      applyTheme();
    }
  };

  switches.forEach((input) => {
    input.addEventListener("change", () => {
      preference = input.checked ? "light" : "dark";
      try { localStorage.setItem(storageKey, preference); } catch { /* 存储失败不阻止本页使用。 */ }
      showTheme(input);
    }, { signal: controller.signal });
  });
  system.addEventListener("change", () => showTheme(), { signal: controller.signal });
  reducedMotion.addEventListener("change", () => showTheme(), { signal: controller.signal });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = validTheme(event.newValue) ? event.newValue : null;
    showTheme();
  }, { signal: controller.signal });
  window.addEventListener("pageshow", () => showTheme(), { signal: controller.signal });
  // 语言变化结束旧主题快照，并按最新语言同步当前状态。
  window.addEventListener("portfolio:languagechange", () => showTheme(), { signal: controller.signal });
  applyTheme();
  // 热更新仅取消本模块过渡；失效回调不能再修改主题。
  return () => {
    controller.abort();
    revision++;
    transition?.skipTransition();
    transition = null;
    clearReveal();
  };
}
