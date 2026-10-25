import type { Locale, LocalizedText } from "../i18n";

// 动态控件读取当前根节点语言，不把静态配置打包到客户端。
export const currentLocale = (): Locale => document.documentElement.lang === "en" ? "en" : "zh-CN";

// 更新普通属性、页面标题和结构化数据，不替换任何页面控件。
export function syncLanguageContent(locale: Locale): void {
  document.querySelectorAll<HTMLElement>("[data-i18n-attributes]").forEach((element) => {
    // 属性字典由静态模板生成，不包含外部输入。
    const attributes = JSON.parse(element.dataset.i18nAttributes!) as Record<string, LocalizedText>;
    Object.entries(attributes).forEach(([name, text]) => element.setAttribute(name, text[locale]));
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-text]").forEach((element) => {
    // 只有 title 使用文本更新，正文继续由双语行内节点展示。
    const text = JSON.parse(element.dataset.i18nText!) as LocalizedText;
    element.textContent = text[locale];
  });
  // 结构化数据保留原有结构，只同步语言相关的身份字段。
  const schema = document.querySelector<HTMLScriptElement>("[data-person-schema]");
  if (schema) schema.textContent = schema.dataset[locale === "en" ? "schemaEn" : "schemaZh"]!;
}

// 同步语言偏好、按钮和跨标签页事件，返回热更新清理方法。
export function initLanguage(): () => void {
  // 存储键与头部首屏恢复逻辑一致。
  const storageKey = "portfolio-language";
  // 写入失败后沿用本页选择，历史恢复不使用尚未保存的旧值覆盖它。
  let storageUnavailable = false;
  // 生命周期控制器仅管理语言模块自己的事件。
  const controller = new AbortController();
  // 页面保留同一按钮，初始化成功后启用交互。
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-language-toggle]");
  // 只接受本站支持的语言值，无效存储回落中文。
  const validLocale = (value: string | null): Locale => value === "en" ? "en" : "zh-CN";
  // 每次应用均触发测量通知，各模块独立保持自己的交互状态。
  const applyLanguage = (locale: Locale) => {
    document.documentElement.lang = locale;
    syncLanguageContent(locale);
    buttons.forEach((button) => {
      // 提示描述下一次操作，按钮正文则显示当前语言。
      const label = locale === "en" ? "Switch to Chinese" : "切换到英文";
      button.title = label;
      button.setAttribute("aria-label", label);
      button.disabled = false;
    });
    window.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { locale } }));
  };
  buttons.forEach((button) => button.addEventListener("click", () => {
    // 存储失败仍保留当前页的手动选择。
    const locale: Locale = currentLocale() === "en" ? "zh-CN" : "en";
    try { localStorage.setItem(storageKey, locale); } catch { storageUnavailable = true; }
    applyLanguage(locale);
  }, { signal: controller.signal }));
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) applyLanguage(validLocale(event.key === null ? null : event.newValue));
  }, { signal: controller.signal });
  window.addEventListener("pageshow", () => {
    // 历史缓存恢复时重新读取偏好，存储受限时沿用本页状态。
    let locale = currentLocale();
    if (!storageUnavailable) {
      try { locale = validLocale(localStorage.getItem(storageKey)); } catch { storageUnavailable = true; }
    }
    applyLanguage(locale);
  }, { signal: controller.signal });
  applyLanguage(currentLocale());
  return () => controller.abort();
}
