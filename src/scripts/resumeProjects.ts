// 在完整静态内容上增强项目切换，无脚本时保留所有项目供阅读。
export function initResumeProjects(): () => void {
  // 热更新时统一释放交互监听。
  const controller = new AbortController();
  document.querySelectorAll<HTMLElement>("[data-resume-projects]").forEach((root) => {
    if (root.dataset.enhanced) return;

    // 按钮与面板以静态生成顺序一一对应，先验证完整性再启用交互。
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-project-tab]"));
    // 所有面板均由 Astro 输出，切换不请求或重建内容。
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-project-panel]"));
    // 增强完成后才显示切换入口，避免出现不可用按钮。
    const tablist = root.querySelector<HTMLElement>("[data-project-tabs]");
    if (!tablist || tabs.length === 0 || tabs.length !== panels.length) return;
    // 和组件左右分栏断点保持一致，窄屏保留顶部切换区。
    const vertical = matchMedia("(min-width: 768px)");
    // 向辅助技术同步标签列表当前排列方向。
    const syncOrientation = (): void => { tablist.setAttribute("aria-orientation", vertical.matches ? "vertical" : "horizontal"); };
    vertical.addEventListener("change", syncOrientation, { signal: controller.signal });
    syncOrientation();

    // 同步可见性、读屏状态与键盘焦点，仅当前项目可以交互。
    const activateProject = (index: number, focus = false): void => {
      tabs.forEach((tab, tabIndex) => {
        // 选中状态同时决定按钮的 Tab 顺序和关联面板的可见性。
        const selected = tabIndex === index;
        // DOM 已在增强前验证数量，此索引始终存在。
        const panel = panels[tabIndex];
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panel.inert = !selected;
        panel.setAttribute("aria-hidden", String(!selected));
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener("click", () => activateProject(index), { signal: controller.signal });
      tab.addEventListener("keydown", (event) => {
        // 按布局方向循环切换，Home 与 End 直接到达首尾项目。
        let nextIndex = index;
        switch (event.key) {
          case "ArrowRight": nextIndex = (index + 1) % tabs.length; break;
          case "ArrowLeft": nextIndex = (index - 1 + tabs.length) % tabs.length; break;
          case "ArrowDown": if (!vertical.matches) return; nextIndex = (index + 1) % tabs.length; break;
          case "ArrowUp": if (!vertical.matches) return; nextIndex = (index - 1 + tabs.length) % tabs.length; break;
          case "Home": nextIndex = 0; break;
          case "End": nextIndex = tabs.length - 1; break;
          default: return;
        }
        event.preventDefault();
        activateProject(nextIndex, true);
      }, { signal: controller.signal });
    });

    activateProject(0);
    root.dataset.enhanced = "true";
    tablist.hidden = false;
  });
  return () => controller.abort();
}
