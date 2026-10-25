import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 将首屏与信息技能区退场绑定到原生滚动，后续内容按正常文档顺序进入。
export function initResumeTransition(): () => void {
  // 固定外层保持布局尺寸稳定，内部整体缩放不干扰节点连线。
  const stage = document.querySelector<HTMLElement>("[data-resume-stage]");
  // 动画层与首屏自身的入场、光点动画分离。
  const motion = stage?.querySelector<HTMLElement>("[data-resume-retreat]");
  // 卡片顶部到达导航下方时，首屏完全退场。
  const overview = document.querySelector<HTMLElement>(".resume-overview");
  // 两张相连卡片共享运动层，避免影响外层测量及鼠标追光。
  const overviewMotion = overview?.querySelector<HTMLElement>("[data-overview-retreat]");
  // 工作经历标题进入固定位置时，信息技能区完成退场。
  const work = document.querySelector<HTMLElement>("[data-resume-work]");
  if (!stage || !motion || !overview) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  // 减少动态效果时保持原生页面，不创建固定和缩放。
  const media = gsap.matchMedia();
  // 避免异步字体加载在组件销毁后重新刷新。
  let disposed = false;
  media.add("(prefers-reduced-motion: no-preference)", () => {
    // 首屏超过视口时先自然滚动至底部，避免手机内容被提前缩走。
    const start = (): string => {
      // 与页面既有顶部留白保持一致。
      const top = parseFloat(getComputedStyle(document.querySelector(".resume-shell")!).paddingTop);
      return stage.offsetHeight > window.innerHeight - top + 1 ? "bottom bottom" : `top ${top}px`;
    };
    // 原路可逆的时间轴不接管滚轮，不改变下方卡片尺寸和阅读顺序。
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start,
        endTrigger: overview,
        end: "top 80px",
        pin: stage,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(motion, { scale: 0.78, y: -24, opacity: 0, filter: "blur(4px)", ease: "none", duration: 1 }, 0);
    timeline.to(stage.querySelector(".flow-scroll"), { opacity: 0, ease: "none", duration: 0.2 }, 0);
    if (overviewMotion && work) {
      // 容器包含卡片外侧底部留白，留白完整进入视口后才固定退场。
      const overviewStart = (): string => overview.offsetHeight > window.innerHeight - 80 + 1 ? "bottom bottom" : "top 80px";
      // 复用首屏的缩放、后移、模糊和淡出参数，向上滚动原路还原。
      const overviewTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: overview,
          start: overviewStart,
          endTrigger: work,
          end: "top 96px",
          pin: overview,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      overviewTimeline.to(overviewMotion, { scale: 0.78, y: -24, filter: "blur(4px)", ease: "none", duration: 1 }, 0);
      // 工作区没有卡片底色，旧正文提前淡出，避免前后两层文字互相干扰。
      overviewTimeline.to(overviewMotion, { opacity: 0, ease: "power1.out", duration: 0.65 }, 0);
    }
  });
  document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(true); });
  return () => {
    disposed = true;
    media.revert();
  };
}
