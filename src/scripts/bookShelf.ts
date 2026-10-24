import { gsap } from "gsap";

// 恢复原画廊的手风琴动画，单选状态保证始终恰好展开一本书。
export function initBookShelf(): () => void {
  // 当前页面只有一个推荐书架，不影响其他动画模块。
  const root = document.querySelector<HTMLElement>("[data-book-shelf]");
  // 固定宽度的滚动外层负责测量，避免监听动画中的书籍宽度。
  const viewport = root?.querySelector<HTMLElement>(".book-shelf-scroll");
  // 桌面书架宽度保持不变，手机书架在内部横向延伸。
  const track = root?.querySelector<HTMLElement>(".book-track");
  if (!root || !viewport || !track) return () => {};

  // 所有位置都参与切换，包含九个纯黑占位。
  const books = Array.from(track.querySelectorAll<HTMLElement>("[data-book]"));
  // 原生同名单选控件保留无 JavaScript 操作和键盘方向键能力。
  const selectors = books.map((book) => book.querySelector<HTMLInputElement>(".book-select")!);
  // 正文与卡片分别运动，保持文字排版稳定。
  const pages = books.map((book) => book.querySelector<HTMLElement>("[data-book-page]")!);
  if (!books.length) return () => {};

  // 断点或减少动态效果偏好变化时，仅重建书架自己的动画上下文。
  const media = gsap.matchMedia();
  media.add({ desktop: "(min-width: 1024px)", compact: "(max-width: 1023px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
    // 手机和平板保留横向书架，减少动态效果时直接切换状态。
    const { compact, reduced } = context.conditions as { compact: boolean; reduced: boolean };
    // 悬停能力独立于屏幕宽度，触屏不响应模拟鼠标事件。
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    // 每次重建保留原来选中的书籍，不重置为第一本。
    let active = Math.max(0, selectors.findIndex((selector) => selector.checked));
    // 同一次切换只保留一个时间轴，快速反向从当前画面继续。
    let timeline: gsap.core.Timeline | null = null;
    // 测量完成后缓存实际展开宽度，正文不随过渡反复换行。
    let expandedWidth = 0;
    // 缓存书籍间距，用于手机切换时将展开项带入阅读区域。
    let itemGap = 0;
    // 控制所有书架事件的生命周期。
    const controller = new AbortController();
    // 防止异步字体回调访问已经清理的书架。
    let disposed = false;

    // 同时更新单选、可访问状态与整排卡片的同步动画。
    const applyLayout = (animate: boolean) => {
      timeline?.kill();
      root.dataset.active = String(active);
      // 原画廊使用 0.6 秒与 power3.out，减少动态效果时取消过渡。
      const duration = animate && !reduced ? 0.6 : 0;
      // 45% 展开比例对应的 flex-grow，剩余位置保持等宽。
      const grow = books.length > 1 ? (0.45 * (books.length - 1)) / 0.55 : 1;
      timeline = gsap.timeline();
      books.forEach((book, index) => {
        // 每次切换只允许一个位置为当前项目。
        const selected = index === active;
        selectors[index].checked = selected;
        pages[index].inert = !selected;
        pages[index].setAttribute("aria-hidden", String(!selected));
        timeline!.to(book, compact
          ? { width: selected ? expandedWidth : 38, rotateY: 0, duration, ease: "power3.out" }
          : { flexGrow: selected ? grow : 1, rotateY: selected ? 0 : index < active ? -8 : 8, duration, ease: "power3.out" }, 0);
        timeline!.to(pages[index], { opacity: selected ? 1 : 0, x: selected ? 0 : -14, duration: selected ? duration : duration * 0.6, ease: "power3.out" }, 0);
      });
      if (compact) timeline.to(viewport, { scrollLeft: active * (38 + itemGap), duration, ease: "power3.out" }, 0);
    };

    // 只在真正切换到另一项时播放，重复点击当前项不会收起。
    const setActive = (index: number) => {
      if (active === index) return;
      active = index;
      applyLayout(true);
    };

    // 响应容器与字体变化；不监听正在动画的卡片以免逐帧打断过渡。
    const measure = () => {
      if (disposed) return;
      // 用内容区宽度排除页面边距和系统滚动条。
      const style = getComputedStyle(viewport);
      // 手机书籍展开后完整容纳在滚动外层内。
      const width = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      // 桌面扣除项目间隔后，展开项占剩余宽度的 45%。
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      itemGap = gap;
      expandedWidth = compact ? Math.min(360, width) : books.length === 1 ? width : Math.max(0, width - gap * (books.length - 1)) * 0.45;
      root.style.setProperty("--book-expanded-width", `${expandedWidth}px`);
      applyLayout(false);
    };

    root.dataset.enhanced = "true";
    measure();
    // 仅订阅固定外层，动画不会触发循环测量。
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    books.forEach((book, index) => {
      book.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse" && hover.matches) setActive(index);
      }, { signal: controller.signal });
      selectors[index].addEventListener("change", () => {
        if (selectors[index].checked) setActive(index);
      }, { signal: controller.signal });
    });
    void document.fonts.ready.then(measure);

    // 仅清理本次断点创建的事件、测量器和时间轴，GSAP 自动还原内联样式。
    return () => {
      disposed = true;
      controller.abort();
      observer.disconnect();
      timeline?.kill();
      books.forEach((book, index) => {
        book.style.removeProperty("width");
        book.style.removeProperty("flex-grow");
        book.style.removeProperty("transform");
        pages[index].style.removeProperty("opacity");
        pages[index].style.removeProperty("transform");
      });
    };
  });

  // 热更新后仍保留单选与 CSS 默认展开，不销毁页面其他 GSAP 实例。
  return () => {
    media.revert();
    delete root.dataset.enhanced;
    root.style.removeProperty("--book-expanded-width");
  };
}
