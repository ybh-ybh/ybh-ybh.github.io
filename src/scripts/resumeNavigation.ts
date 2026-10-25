// 基于固定层的原始占位定位，避免缩放和固定动画使章节锚点漂移。
export function initResumeNavigation(): () => void {
  // 中央胶囊导航独立于首页页头。
  const nav = document.querySelector<HTMLElement>("[data-resume-nav]");
  if (!nav) return () => {};
  // 三个原生锚点在无脚本环境仍能使用。
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
  // 与导航锚点一一对应的原始内容区域。
  const sections = links.map((link) => document.getElementById(link.hash.slice(1)));
  // 统一取消所有事件监听。
  const controller = new AbortController();
  // 合并高频滚动事件，一帧只读取一次布局。
  let frame = 0;
  // 字体就绪回调在清理后不再执行。
  let disposed = false;

  // GSAP固定时读取占位层，保留章节在文档流里的真实位置。
  const sectionTop = (section: HTMLElement): number => {
    // 固定容器会动态包裹占位元素，未固定时直接读取自身。
    const anchor = section.parentElement?.classList.contains("pin-spacer") ? section.parentElement : section;
    return anchor.getBoundingClientRect().top + window.scrollY;
  };

  // 高亮只跟随真实阅读位置，不在点击时提前切换。
  const update = (): void => {
    frame = 0;
    // 视口上部阅读线用于判断当前章节。
    const readingLine = window.scrollY + Math.max(112, window.innerHeight * 0.35);
    // 到达后续章节前默认首屏。
    let active = 0;
    sections.forEach((section, index) => { if (section && sectionTop(section) <= readingLine) active = index; });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    // 读取选中按钮的真实尺寸，兼容长短标签及手机断点。
    const selected = links[active];
    if (selected) {
      nav.style.setProperty("--nav-x", `${selected.offsetLeft}px`);
      nav.style.setProperty("--nav-y", `${selected.offsetTop}px`);
      nav.style.setProperty("--nav-width", `${selected.offsetWidth}px`);
      nav.style.setProperty("--nav-height", `${selected.offsetHeight}px`);
      nav.setAttribute("data-indicator-ready", "");
    }
  };

  // 避免滚动和窗口尺寸变化重复测量。
  const schedule = (): void => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
  // 字体与布局改变时重新对齐底衬，不依赖用户再次滚动。
  const observer = new ResizeObserver(schedule);
  observer.observe(nav);
  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      // 保留原生链接的容错行为，找不到目标时不拦截。
      const section = sections[index];
      if (!section) return;
      event.preventDefault();
      window.scrollTo({
        top: index === 0 ? 0 : Math.max(0, sectionTop(section) - 96),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }, { signal: controller.signal });
  });
  window.addEventListener("scroll", schedule, { passive: true, signal: controller.signal });
  window.addEventListener("resize", schedule, { signal: controller.signal });
  window.addEventListener("pageshow", schedule, { signal: controller.signal });
  document.fonts.ready.then(schedule);
  schedule();
  return () => { disposed = true; cancelAnimationFrame(frame); controller.abort(); observer.disconnect(); nav.removeAttribute("data-indicator-ready"); };
}
