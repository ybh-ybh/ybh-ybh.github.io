import { gsap } from "gsap";

// 根据实际节点排版绘制能力与项目连线，并独立管理首屏动画的生命周期。
export function initResumeHero(): () => void {
  // 首屏只初始化当前页面自己的节点，不影响首页既有动画。
  const root = document.querySelector<HTMLElement>("[data-resume-hero]");
  // 画布同时作为 SVG 坐标原点和尺寸观察目标。
  const canvas = root?.querySelector<HTMLElement>("[data-flow-canvas]");
  // 装饰图层不参与布局和指针交互。
  const svg = root?.querySelector<SVGSVGElement>("[data-flow-svg]");
  // 头像边缘是桌面所有连线的汇入和分出位置。
  const hub = root?.querySelector<HTMLElement>("[data-flow-hub]");
  // 手机出线从身份文字下方开始，避免穿过姓名和职业方向。
  const identity = root?.querySelector<HTMLElement>("[data-flow-identity]");
  // 中央柔光仅改变透明度和缩放，不移动正文。
  const halo = root?.querySelector<HTMLElement>("[data-flow-halo]");
  if (!root || !canvas || !svg || !hub || !identity || !halo) return () => {};

  // 静态生成的节点、路径与光点按同一顺序配对。
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-flow-node]"));
  // 路径保留在 SVG 中，尺寸变化时仅更新曲线坐标。
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-flow-line]"));
  // 每条路径只对应一个带柔光的移动光点。
  const particles = Array.from(svg.querySelectorAll<SVGGElement>("[data-flow-particle]"));
  if (!nodes.length || nodes.length !== paths.length || nodes.length !== particles.length) return () => {};

  // 路径长度只在布局变化时测量，逐帧更新只读取缓存。
  const routes = nodes.map((node, index) => ({ node, path: paths[index], particle: particles[index], length: 0, progress: 0 }));
  // 动态效果偏好变化后立即在动效与静态图之间切换。
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // 与组件 CSS 共用同一横向布局断点。
  const desktop = window.matchMedia("(min-width: 768px)");
  // 统一取消本模块的事件监听。
  const controller = new AbortController();
  // 热更新后阻止字体加载等异步回调继续访问旧节点。
  let disposed = false;
  // 同一帧内合并尺寸、字体和窗口变化带来的测量请求。
  let measureFrame = 0;
  // 固定层切换可能让交叉观察器保留旧状态，滚动后复核真实可见范围。
  let visibilityFrame = 0;
  // 分离有限入场与无限流动，离屏时一起暂停。
  let intro: gsap.core.Timeline | null = null;
  // 所有循环效果都放在一个时间轴中统一暂停。
  let loop: gsap.core.Timeline | null = null;
  // 入场只在首次初始化播放，偏好切换时不重复闪烁。
  let entered = false;
  // 首次通过真实位置判断，后续由 IntersectionObserver 更新。
  let inView = root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top < window.innerHeight;

  // 让光点沿 SVG 的真实曲线运行，在首尾平滑隐去。
  const renderParticle = (route: (typeof routes)[number]): void => {
    if (!route.length) return;
    // 曲线采样点与路径共享坐标，屏幕缩放后仍准确重合。
    const point = route.path.getPointAtLength(route.length * route.progress);
    route.particle.setAttribute("transform", `translate(${point.x} ${point.y})`);
    route.particle.setAttribute("opacity", String(Math.min(route.progress * 8, (1 - route.progress) * 8, 0.95)));
  };

  // 仅在页面可见且首屏处于视口时运行动画。
  const syncPlayback = (): void => {
    // 减少动态效果同时禁止入场、光点和柔光呼吸。
    const running = inView && !document.hidden && !reducedMotion.matches;
    intro?.paused(!running);
    loop?.paused(!running);
    root.dataset.motionState = reducedMotion.matches ? "static" : running ? "running" : "paused";
  };

  // 等待滚动固定层定位完成后再决定是否播放，避免首屏停在透明入场状态。
  const scheduleVisibility = (): void => {
    if (visibilityFrame || disposed) return;
    visibilityFrame = requestAnimationFrame(() => {
      visibilityFrame = 0;
      // 使用最终屏幕边界，而不是固定层重排过程中的临时交叉结果。
      const rect = root.getBoundingClientRect();
      inView = rect.bottom > 0 && rect.top < window.innerHeight;
      syncPlayback();
    });
  };

  // 用实际边界生成曲线，桌面水平汇聚，手机在两列之间竖直布线。
  const measure = (): void => {
    measureFrame = 0;
    if (disposed) return;
    // 所有矩形在同一帧读取，避免逐条路径写入时触发布局抖动。
    const bounds = canvas.getBoundingClientRect();
    // 头像矩形用于计算左右和上侧的连接端点。
    const hubBounds = hub.getBoundingClientRect();
    // 身份文字底部是手机项目连线的起点。
    const identityBounds = identity.getBoundingClientRect();
    // 一次性读取全部节点位置，后续只写 SVG 属性。
    const nodeBounds = nodes.map((node) => node.getBoundingClientRect());
    if (!bounds.width || !bounds.height) return;
    // 中央锚点转换为画布局部坐标。
    const centerX = hubBounds.left + hubBounds.width / 2 - bounds.left;
    // 桌面曲线始终通过头像的垂直中心。
    const centerY = hubBounds.top + hubBounds.height / 2 - bounds.top;
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    routes.forEach((route, index) => {
      // 对应节点的矩形与语义方向。
      const rect = nodeBounds[index];
      // 能力汇入身份，项目从身份向外流出。
      const incoming = route.node.dataset.flowNode === "skill";
      // 当前连线完整路径，统一在计算后写入。
      let curve: string;
      if (desktop.matches) {
        // 水平布局的起点和终点均落在可见元素边缘。
        const startX = incoming ? rect.right - bounds.left : hubBounds.right - bounds.left;
        // 能力起点按节点高度排列，项目起点统一在头像中心。
        const startY = incoming ? rect.top + rect.height / 2 - bounds.top : centerY;
        // 汇入左边缘，分流到右侧项目的左边缘。
        const endX = incoming ? hubBounds.left - bounds.left : rect.left - bounds.left;
        // 项目终点跟随各自标签的垂直中心。
        const endY = incoming ? centerY : rect.top + rect.height / 2 - bounds.top;
        // 控制点保持水平切线，避免折角与过度绕行。
        const bend = (endX - startX) * 0.52;
        curve = `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`;
      } else {
        // 左列取右边缘、右列取左边缘，连线只经过中间的空白通道。
        const edgeX = (rect.left + rect.width / 2 < hubBounds.left + hubBounds.width / 2 ? rect.right : rect.left) - bounds.left;
        // 标签垂直中心作为侧向接入位置。
        const edgeY = rect.top + rect.height / 2 - bounds.top;
        // 进线连接头像顶部，出线从职业方向下方开始。
        const anchorY = incoming ? hubBounds.top - bounds.top : identityBounds.bottom - bounds.top + 8;
        curve = incoming
          ? `M ${edgeX} ${edgeY} C ${centerX} ${edgeY}, ${centerX} ${edgeY}, ${centerX} ${anchorY}`
          : `M ${centerX} ${anchorY} C ${centerX} ${edgeY}, ${centerX} ${edgeY}, ${edgeX} ${edgeY}`;
      }
      route.path.setAttribute("d", curve);
      route.length = route.path.getTotalLength();
      if (!reducedMotion.matches) renderParticle(route);
    });
    root.dataset.flowReady = "true";
  };

  // 尺寸观察回调只排入下一帧，不在观察器中修改被观察元素。
  const scheduleMeasure = (): void => {
    if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
  };

  // 初始化或偏好变化时重建本模块动画，静态内容始终由 Astro 提供。
  const configureMotion = (): void => {
    intro?.progress(1).kill();
    intro = null;
    loop?.kill();
    loop = null;
    gsap.set(halo, { scale: 1, opacity: 1 });
    particles.forEach((particle) => particle.setAttribute("opacity", "0"));
    if (reducedMotion.matches) {
      entered = true;
      syncPlayback();
      return;
    }
    if (!entered) {
      intro = gsap.timeline({ paused: true });
      intro.fromTo([...nodes, identity, ...root.querySelectorAll(".flow-caption")], { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.035, ease: "power1.out", clearProps: "opacity" });
      intro.fromTo(paths, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.045, ease: "power2.out", clearProps: "strokeDasharray,strokeDashoffset" }, 0.2);
    }
    loop = gsap.timeline({ paused: true, delay: entered ? 0 : 1.1 });
    routes.forEach((route, index) => {
      route.progress = 0;
      loop!.to(route, {
        progress: 1,
        duration: 3.8 + (index % 3) * 0.35,
        ease: "none",
        repeat: -1,
        repeatDelay: 0.65,
        onUpdate: () => renderParticle(route),
      }, (index % 6) * 0.48);
    });
    loop.to(halo, { scale: 1.08, opacity: 0.65, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0);
    entered = true;
    syncPlayback();
  };

  // 观察布局和字体变化，不观察光点等纯装饰节点。
  const resizeObserver = new ResizeObserver(scheduleMeasure);
  resizeObserver.observe(canvas);
  resizeObserver.observe(identity);
  nodes.forEach((node) => resizeObserver.observe(node));
  // 离屏后停止所有循环，回到首屏再从原位置继续。
  const visibilityObserver = new IntersectionObserver(scheduleVisibility);
  visibilityObserver.observe(root);
  document.addEventListener("visibilitychange", syncPlayback, { signal: controller.signal });
  window.addEventListener("resize", scheduleMeasure, { signal: controller.signal });
  window.addEventListener("scroll", scheduleVisibility, { passive: true, signal: controller.signal });
  window.addEventListener("resize", scheduleVisibility, { signal: controller.signal });
  window.addEventListener("pageshow", scheduleMeasure, { signal: controller.signal });
  reducedMotion.addEventListener("change", configureMotion, { signal: controller.signal });
  document.fonts.ready.then(scheduleMeasure);
  measure();
  configureMotion();

  // 释放动画、观察器与待执行帧，避免热更新或卸载留下后台工作。
  return () => {
    disposed = true;
    controller.abort();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    cancelAnimationFrame(measureFrame);
    cancelAnimationFrame(visibilityFrame);
    intro?.kill();
    loop?.kill();
  };
}
