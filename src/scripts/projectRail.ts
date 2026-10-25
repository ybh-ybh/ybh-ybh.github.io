// 初始化项目横线导航；悬停预览与滚动高亮分别维护。
export function initProjectRail(): () => void {
  // 统一项目区域与它的独立导航容器。
  const scope = document.getElementById("projects");
  // 固定在项目卡片外侧的导航容器。
  const root = scope?.querySelector<HTMLElement>("[data-project-rail]");
  // 横线列表负责指针距离计算。
  const list = root?.querySelector<HTMLElement>("[data-project-rail-list]");
  if (!scope || !root || !list) return () => {};

  // 底部编号只跟随实际阅读项目，不随悬停预览改变。
  const currentLabel = root.querySelector<HTMLElement>("[data-project-current]");
  // 每条横线及预览都来自服务端的同一份项目列表。
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>("[data-project-link]"));
  // 按链接目标获取卡片，避免另外维护滚动目标顺序。
  const targets = links.map((link) => document.getElementById(link.hash.slice(1)));
  // 预览内容预先渲染，无需悬停时请求或拼接 HTML。
  const previews = links.map((link) => document.getElementById(link.dataset.previewId ?? ""));
  // 读取真实导航高度，保证阅读线位于顶部导航之下。
  const header = document.querySelector<HTMLElement>(".site-header");
  // 与组件 CSS 使用完全一致的桌面条件。
  const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  // 使用一个中止控制器统一清理所有监听。
  const controller = new AbortController();
  // 当前阅读的项目，独立于悬停状态。
  let activeIndex = -1;
  // 当前展开预览的项目。
  let previewIndex = -1;
  // 点击或 Escape 后，暂不重新展开相同条目的预览。
  let suppressedIndex = -1;
  // 指针或键盘焦点对应的纵向位置，用于相邻横线的伸长。
  let pointerY: number | null = null;
  // 滚动和窗口变化共享一帧更新。
  let frame = 0;
  // 阻止字体加载回调唤醒已经销毁的实例。
  let disposed = false;

  // 按距离平滑伸长附近横线，当前项目始终保留最小强调长度。
  const drawTicks = () => {
    links.forEach((link, index) => {
      // 距离越近，横线越接近 36px 的最大宽度。
      const bounds = link.getBoundingClientRect();
      // 64px 范围内的相邻条目按距离逐级伸长。
      const proximity = pointerY === null ? 0 : Math.max(0, 1 - Math.abs(pointerY - bounds.top - bounds.height / 2) / 64);
      // 当前项目使用 28px，其他项目默认 18px，悬停最长 36px。
      const width = Math.max(index === activeIndex ? 28 : 18, 18 + proximity * 18);
      link.style.setProperty("--tick-width", `${width}px`);
    });
  };

  // 预览向左展开，并限制在屏幕上下边缘之内。
  const positionPreview = () => {
    if (previewIndex < 0) return;
    // 当前条目的位置和预览的真实高度。
    const preview = previews[previewIndex];
    if (!preview) return;
    // 目标横线的视口位置。
    const linkBounds = links[previewIndex].getBoundingClientRect();
    // 预览半高用于上下边缘限位。
    const halfHeight = preview.getBoundingClientRect().height / 2;
    // 将预览中心限制在安全边距内，再换算成导航内部坐标。
    const center = Math.max(halfHeight + 16, Math.min(window.innerHeight - halfHeight - 16, linkBounds.top + linkBounds.height / 2));
    preview.style.top = `${center - root.getBoundingClientRect().top}px`;
  };

  // 收起预览时保留真实的滚动高亮。
  const hidePreview = (suppress = false) => {
    if (suppress && previewIndex >= 0) suppressedIndex = previewIndex;
    previewIndex = -1;
    pointerY = null;
    links.forEach((link, index) => {
      link.dataset.previewing = "false";
      link.removeAttribute("aria-describedby");
      // 不可见的预览不参与命中或辅助技术阅读。
      const preview = previews[index];
      if (preview) {
        preview.dataset.open = "false";
        preview.setAttribute("aria-hidden", "true");
        preview.inert = true;
      }
    });
    drawTicks();
  };

  // 展开指定项目的本地文字预览，不修改当前项目。
  const showPreview = (index: number) => {
    if (root.dataset.visible !== "true" || index === suppressedIndex) return;
    suppressedIndex = -1;
    previewIndex = index;
    links.forEach((link, itemIndex) => {
      // 同一时刻只展开一个预览。
      const open = itemIndex === index;
      // 当前条目对应的预渲染内容。
      const preview = previews[itemIndex];
      link.dataset.previewing = String(open);
      if (open && preview) link.setAttribute("aria-describedby", preview.id);
      else link.removeAttribute("aria-describedby");
      if (preview) {
        preview.dataset.open = String(open);
        preview.setAttribute("aria-hidden", String(!open));
        preview.inert = !open;
      }
    });
    positionPreview();
  };

  // 根据固定导航下方的阅读线更新项目高亮和整体可见性。
  const update = () => {
    // 项目之间的空隙仍归属于前一个已经读到的项目。
    const readingLine = (header?.getBoundingClientRect().bottom ?? 0) + 32;
    // 整个项目区域的可见边界。
    const bounds = scope.getBoundingClientRect();
    // 仅在桌面且阅读线处于项目区域时允许交互。
    const visible = desktop.matches && bounds.top <= readingLine && bounds.bottom > readingLine;
    // 首张卡片作为列表顶部空隙的默认项目。
    let nextActive = 0;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= readingLine) nextActive = index;
    });
    if (nextActive !== activeIndex) {
      activeIndex = nextActive;
      if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
      links.forEach((link, index) => {
        if (index === activeIndex) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    root.dataset.visible = String(visible);
    // 先禁用交互，再隐藏辅助技术内容，避免隐藏仍持有焦点的链接。
    root.inert = !visible;
    root.setAttribute("aria-hidden", String(!visible));
    if (!visible) {
      suppressedIndex = -1;
      hidePreview();
    } else {
      drawTicks();
      positionPreview();
    }
  };

  // 高频滚动事件只安排一帧布局读取和状态更新。
  const schedule = () => {
    if (disposed || frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  };

  // 指针接近任一横线时，显示最近条目并让附近横线逐级伸长。
  const onPointerMove = (event: PointerEvent) => {
    pointerY = event.clientY;
    // 以点击区域中心计算距离，确保两条线之间也能连续变化。
    let nearest = 0;
    // 暂存目前最小距离。
    let distance = Infinity;
    links.forEach((link, index) => {
      // 当前条目到指针的纵向距离。
      const bounds = link.getBoundingClientRect();
      // 逐项比较，选取指针最近的横线。
      const nextDistance = Math.abs(event.clientY - bounds.top - bounds.height / 2);
      if (nextDistance < distance) {
        nearest = index;
        distance = nextDistance;
      }
    });
    showPreview(nearest);
    drawTicks();
  };

  list.addEventListener("pointermove", onPointerMove, { signal: controller.signal });
  root.addEventListener("pointerleave", () => {
    suppressedIndex = -1;
    hidePreview();
  }, { signal: controller.signal });
  root.addEventListener("focusout", (event) => {
    if (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget)) hidePreview();
  }, { signal: controller.signal });
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      hidePreview(true);
    }
  }, { signal: controller.signal });

  links.forEach((link, index) => {
    link.addEventListener("focus", () => {
      suppressedIndex = -1;
      // 键盘焦点使用与指针居中悬停相同的伸长效果。
      const bounds = link.getBoundingClientRect();
      pointerY = bounds.top + bounds.height / 2;
      showPreview(index);
      drawTicks();
    }, { signal: controller.signal });
    link.addEventListener("click", () => {
      // 使用真实锚点的默认滚动和历史行为，点击后收起预览。
      suppressedIndex = index;
      hidePreview(true);
    }, { signal: controller.signal });
  });

  window.addEventListener("scroll", schedule, { passive: true, signal: controller.signal });
  window.addEventListener("resize", schedule, { signal: controller.signal });
  // 双语正文换行后刷新当前预览位置，保留高亮及悬停状态。
  window.addEventListener("portfolio:languagechange", schedule, { signal: controller.signal });
  window.addEventListener("pageshow", schedule, { signal: controller.signal });
  window.addEventListener("load", schedule, { signal: controller.signal });
  desktop.addEventListener("change", schedule, { signal: controller.signal });
  void document.fonts.ready.then(schedule);
  update();

  // 热更新时只清理本组件的事件、预览及内联宽度。
  return () => {
    disposed = true;
    controller.abort();
    window.cancelAnimationFrame(frame);
    root.dataset.visible = "false";
    root.inert = true;
    root.setAttribute("aria-hidden", "true");
    hidePreview();
    links.forEach((link) => {
      link.style.removeProperty("--tick-width");
      link.removeAttribute("aria-current");
    });
  };
}
