import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 能完整容纳内容时固定整个工作区，以原生滚动进度原位切换职责。
export function initResumeWork(): () => void {
  // 模块根节点保留在正常文档流内。
  const root = document.querySelector<HTMLElement>("[data-resume-work]");
  // 标题、横线、时间线与职责共用同一个固定层。
  const stage = root?.querySelector<HTMLElement>("[data-work-stage]");
  if (!root || !stage) return () => {};
  // 两家公司面板同格占位，避免切换高度跳动。
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".work-panel"));
  // 降级模式下的自然滚动目标。
  const duties = Array.from(root.querySelectorAll<HTMLElement>("[data-work-duties]"));
  // 桌面和手机共享相同索引。
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-work-index]"));
  // 减少动态效果时始终完整展开职责。
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // 所有事件监听的统一清理信号。
  const controller = new AbortController();
  // 上下文只回收本模块的GSAP样式与固定间距。
  let context: gsap.Context | undefined;
  // 点击圆圈时读取当前有效的滚动区间。
  let trigger: ScrollTrigger | undefined;
  // 合并窗口尺寸与字体变化引发的重建。
  let frame = 0;
  // 防止卸载后异步字体回调继续工作。
  let disposed = false;
  // 只在工作区可见且标签页处于前台时运行连接线动效。
  let inView = false;
  // 动画暂停不影响滚动进度与职责切换。
  const syncFlow = (): void => {
    root.toggleAttribute("data-work-running", inView && !document.hidden);
  };
  // 独立观察工作区，离屏后停止循环绘制。
  const flowObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncFlow();
  });
  flowObserver.observe(root);
  document.addEventListener("visibilitychange", syncFlow, { signal: controller.signal });
  gsap.registerPlugin(ScrollTrigger);

  // 将滚动进度映射到圆圈之间的连接条，不创建独立循环动画。
  const setProgress = (progress: number): void => {
    root.style.setProperty("--work-progress", String(Math.max(0, Math.min(1, progress))));
  };

  // 固定模式下同步节点状态和连接条长度。
  const syncPinned = (self: ScrollTrigger): void => {
    select(self.progress >= 0.5 ? 1 : 0);
    setProgress(self.progress);
  };

  // 当前节点与屏幕、读屏可见的职责同步切换。
  const select = (index: number): void => {
    buttons.forEach((button) => {
      if (Number(button.dataset.workIndex) === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    panels.forEach((panel, panelIndex) => {
      // 降级模式全部可读，固定模式只开放当前一段。
      const hidden = root.hasAttribute("data-work-pinned") && panelIndex !== index;
      panel.inert = hidden;
      if (hidden) panel.setAttribute("aria-hidden", "true");
      else panel.removeAttribute("aria-hidden");
    });
  };

  // 自然展开模式仍按阅读位置标记公司，但不隐藏任何职责。
  const syncNatural = (): void => {
    // 进入工作区前默认第一家。
    let index = 0;
    duties.forEach((duty, i) => { if (duty.getBoundingClientRect().top <= innerHeight * 0.4) index = i; });
    select(index);
    // 自然阅读时，以两段职责之间的实际距离计算填充进度。
    const firstTop = duties[0].getBoundingClientRect().top;
    // 避免极小布局距离导致除零。
    const distance = Math.max(1, duties[1].getBoundingClientRect().top - firstTop);
    setProgress((innerHeight * 0.4 - firstTop) / distance);
  };

  // 尺寸变化时先还原布局，再实测同格面板是否能完整显示。
  const configure = (): void => {
    frame = 0;
    if (disposed) return;
    // 重建时移除固定占位可能让浏览器截短滚动位置，布局恢复后还原。
    const savedScroll = window.scrollY;
    context?.revert();
    trigger = undefined;
    root.removeAttribute("data-work-pinned");
    select(0);
    if (innerWidth >= 1024 && !reduced.matches && panels.length === 2) {
      root.setAttribute("data-work-pinned", "");
      // 顶部96px与底部32px预留，超出时完整展开而不裁切。
      if (stage.offsetHeight > innerHeight - 128) root.removeAttribute("data-work-pinned");
    }
    context = gsap.context(() => {
      if (!root.hasAttribute("data-work-pinned")) {
        ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: syncNatural, onRefresh: syncNatural });
        syncNatural();
        return;
      }
      select(0);
      gsap.set(panels[0], { opacity: 1, y: 0 });
      gsap.set(panels[1], { opacity: 0, y: 12 });
      // 时间轴总长1：40%阅读、10%退场、10%入场、40%阅读。
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage, start: "top 96px", end: () => `+=${innerHeight * 0.8}`,
          pin: stage, pinSpacing: true, scrub: true, invalidateOnRefresh: true,
          onUpdate: syncPinned,
          onRefresh: syncPinned,
        },
      });
      timeline.to(panels[0], { opacity: 0, y: -12, duration: 0.1, ease: "none" }, 0.4);
      timeline.to(panels[1], { opacity: 1, y: 0, duration: 0.1, ease: "none" }, 0.5);
      timeline.to({}, { duration: 0.4 }, 0.6);
      trigger = timeline.scrollTrigger;
      // 初始恢复到页面真实滚动位置，不先闪出错误公司的职责。
      trigger?.refresh();
      timeline.progress(trigger?.progress ?? 0);
      select((trigger?.progress ?? 0) >= 0.5 ? 1 : 0);
      setProgress(trigger?.progress ?? 0);
    }, root);
    ScrollTrigger.refresh();
    window.scrollTo({ top: savedScroll, behavior: "instant" });
    ScrollTrigger.update();
  };

  // 一帧至多重建一次，不在滚动过程中不断测量高度。
  const scheduleConfigure = (): void => {
    if (!disposed && !frame) frame = requestAnimationFrame(configure);
  };
  buttons.forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", () => {
      // 点击只改变滚动目标，当前公司仍完全由实际进度决定。
      const index = Number(button.dataset.workIndex);
      if (trigger) {
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * (index === 0 ? 0.2 : 0.8), behavior: "smooth" });
      } else {
        duties[index]?.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
      }
    }, { signal: controller.signal });
  });
  window.addEventListener("resize", scheduleConfigure, { signal: controller.signal });
  window.addEventListener("pageshow", scheduleConfigure, { signal: controller.signal });
  reduced.addEventListener("change", scheduleConfigure, { signal: controller.signal });
  document.fonts.ready.then(scheduleConfigure);
  configure();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    controller.abort();
    flowObserver.disconnect();
    root.removeAttribute("data-work-running");
    context?.revert();
    root.removeAttribute("data-work-pinned");
    root.style.removeProperty("--work-progress");
    select(0);
    buttons.forEach((button) => { button.disabled = true; button.removeAttribute("aria-current"); });
  };
}
