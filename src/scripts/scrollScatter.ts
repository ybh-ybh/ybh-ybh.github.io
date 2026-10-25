import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 为首页前两段创建从中间向两侧水平拨开的动画，并返回局部清理方法。
export function initScrollScatter(): () => void {
  // 只有这个容器内的元素参与散开，其他页面区域不受影响。
  const scope = document.querySelector<HTMLElement>("[data-scroll-scatter]");
  if (!scope) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  // 媒体查询切换时自动还原旧动画和内联样式。
  const media = gsap.matchMedia(scope);
  // 防止已销毁实例被字体加载或历史恢复回调重新唤醒。
  let disposed = false;
  // 合并同一帧内的布局更新请求。
  let refreshFrame = 0;

  media.add(
    {
      desktop: "(min-width: 768px)",
      mobile: "(max-width: 767px)",
      reducedMotion: "(prefers-reduced-motion: reduce)",
    },
    // 根据当前屏幕和动态效果偏好构建本轮动画。
    (context) => {
      if (context.conditions?.reducedMotion) return;

      // 手机缩小拨开距离，保持阅读区域稳定。
      const mobile = Boolean(context.conditions?.mobile);
      // 只在首页和关于我两个区域内创建动画。
      const sections = scope.querySelectorAll<HTMLElement>("[data-scatter-section]");

      sections.forEach((section) => {
        // 静止容器提供稳定的布局坐标，运动层不会影响触发计算。
        const items = section.querySelectorAll<HTMLElement>("[data-scatter-item]");

        items.forEach((item) => {
          // 每个静止容器只控制自己的直接子运动层。
          const motion = item.querySelector<HTMLElement>(":scope > [data-scatter-motion]");
          if (!motion) return;

          // 方向与页面左右布局一致，避免文字和头像交叉穿行。
          const direction = item.dataset.scatterSide === "right" ? 1 : -1;
          // 同侧内容共用静止动作组，保持段落、标题和按钮一起平移。
          const group = item.closest<HTMLElement>("[data-scatter-group]") ?? item;

          // 内容底部经过阅读区域后才飞离，锚点落位时始终保持完整。
          const getStart = () => {
            // 视口高度决定阅读区和拨开过程的滚动距离。
            const height = window.innerHeight;
            // 页面配置的锚点偏移与固定导航保持一致。
            const margin = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
            // 当前区域允许开始动画的最早文档位置。
            const sectionStart = Math.max(0, section.getBoundingClientRect().top + window.scrollY - margin);
            // 读取动作组的稳定边界，组内所有元素使用相同进度。
            const bounds = group.getBoundingClientRect();
            // 首屏按整体中心触发，长正文和卡片在底部经过阅读区后触发。
            const edge = group.dataset.scatterStart === "center" ? bounds.top + bounds.height / 2 : bounds.bottom;
            return Math.max(sectionStart, edge + window.scrollY - height * 0.45);
          };

          // 两侧使用相等距离向外拨开，保持水平，不追逐各自的屏幕边缘。
          const getDistance = () => {
            // 排除滚动条后的可视宽度。
            const width = document.documentElement.clientWidth;
            return direction * (mobile ? Math.min(width * 0.28, 120) : Math.min(width * 0.22, 320));
          };

          // 滚动进度直接映射到时间线，途中可以立即反向。
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: item,
              start: getStart,
              end: () => getStart() + window.innerHeight * 0.5,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(motion, { x: 0, rotation: 0, autoAlpha: 1 }, {
            x: getDistance,
            rotation: 0,
            duration: 1,
          }, 0);
          timeline.to(motion, { autoAlpha: 0, duration: 0.35 }, 0.65);
        });
      });
    },
  );

  // 字体和历史位置恢复可能改变布局，在下一帧刷新并同步当前滚动位置。
  const refresh = () => {
    if (disposed) return;
    window.cancelAnimationFrame(refreshFrame);
    refreshFrame = window.requestAnimationFrame(() => {
      // 等待原生平滑滚动结束，避免刷新测量打断锚点或历史位置恢复。
      ScrollTrigger.refresh(true);
      ScrollTrigger.update();
    });
  };

  window.addEventListener("pageshow", refresh);
  window.addEventListener("load", refresh);
  window.addEventListener("portfolio:languagechange", refresh);
  void document.fonts.ready.then(refresh);
  refresh();

  // 仅销毁本模块的动画，保留其他 GSAP 实例。
  return () => {
    disposed = true;
    window.cancelAnimationFrame(refreshFrame);
    window.removeEventListener("pageshow", refresh);
    window.removeEventListener("load", refresh);
    window.removeEventListener("portfolio:languagechange", refresh);
    media.revert();
  };
}
