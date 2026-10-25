// 为简历玻璃卡片添加鼠标聚光灯，卡片本身保持静止。
export function initResumeGlow(): () => void {
  // 统一监听基础信息与技能区域内的鼠标移动。
  const overview = document.querySelector<HTMLElement>(".resume-overview");
  if (!overview) return () => {};
  // 只增强基本信息与专业技能，不影响其他玻璃控件。
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".resume-overview .resume-glass"));
  // 触屏、粗指针和减少动态效果均保留静态卡片。
  const eligible = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  // 生命周期监听与可动态撤销的鼠标监听分别管理。
  const lifecycle = new AbortController();
  // 页面离开或偏好改变时一次性撤销交互监听。
  let interactions: AbortController | undefined;
  // 一帧最多写入一次坐标，空闲时不运行循环。
  let frame = 0;
  // 当前光效所属卡片，跨卡片时立即清除旧状态。
  let active: HTMLElement | null = null;
  // 缓存最新鼠标横坐标。
  let clientX = 0;
  // 缓存最新鼠标纵坐标。
  let clientY = 0;

  // 滚动、离开或切换卡片时停止待执行帧并淡出。
  const hide = (): void => {
    cancelAnimationFrame(frame);
    frame = 0;
    active?.removeAttribute("data-glow-active");
    active = null;
  };

  // 使用本帧实际矩形计算坐标，避免滚动或布局变化后的偏移。
  const render = (): void => {
    frame = 0;
    if (!active) return;
    // 直接使用当前卡片边界，聚光坐标不依赖外层布局。
    const rect = active.getBoundingClientRect();
    active.style.setProperty("--glow-x", `${clientX - rect.left}px`);
    active.style.setProperty("--glow-y", `${clientY - rect.top}px`);
    active.setAttribute("data-glow-active", "");
  };

  // 清理可重建的交互监听，支持浏览器前进后退缓存。
  const stop = (): void => {
    hide();
    interactions?.abort();
    interactions = undefined;
  };

  // 每次偏好变化或页面恢复时重新判断是否启用。
  const configure = (): void => {
    stop();
    if (!eligible.matches) return;
    interactions = new AbortController();
    // 当前一轮监听共用同一个清理信号。
    const signal = interactions.signal;
      // 只跟随鼠标，混合设备上的触摸不会触发残留光效。
      const move = (event: PointerEvent): void => {
        if (event.pointerType !== "mouse") return;
        // 跨越上下模块时只切换光晕所属卡片。
        const card = event.target instanceof Element ? event.target.closest<HTMLElement>(".resume-glass") : null;
        if (active !== card) {
          active?.removeAttribute("data-glow-active");
          active = card && cards.includes(card) ? card : null;
        }
        clientX = event.clientX;
        clientY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      };
      overview.addEventListener("pointermove", move, { passive: true, signal });
      overview.addEventListener("pointerleave", hide, { signal });
      overview.addEventListener("pointercancel", hide, { signal });
    window.addEventListener("scroll", hide, { passive: true, capture: true, signal });
    window.addEventListener("resize", hide, { passive: true, signal });
    window.addEventListener("blur", hide, { signal });
  };
  eligible.addEventListener("change", configure, { signal: lifecycle.signal });
  window.addEventListener("pagehide", stop, { signal: lifecycle.signal });
  window.addEventListener("pageshow", configure, { signal: lifecycle.signal });
  configure();
  return () => { stop(); lifecycle.abort(); };
}
