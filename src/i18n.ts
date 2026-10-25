import { siteConfig } from "./config";

// 页面仅支持中文和英文，中文作为静态输出与首次访问的默认值。
export type Locale = "zh-CN" | "en";
// 同一份文案同时供静态模板和客户端属性同步使用。
export type LocalizedText = Record<Locale, string>;

// 将现有中文配置与英文译文组合，避免重复维护中文内容。
export const bilingual = (chinese: string, english: string): LocalizedText => ({ "zh-CN": chinese, en: english });

// 所有可翻译内容集中维护，图片、链接、书脊和技术品牌继续共用原配置。
export const copy = {
  name: bilingual(siteConfig.name, "Baihao Ye"),
  title: bilingual(siteConfig.title, "Software Developer / AI Native / Swimming Enthusiast"),
  description: bilingual(siteConfig.description, "Baihao Ye's personal website: focused on Context Engineering, RAG, Long-term Memory, and Agent Runtime, building reliable, explainable agents for real-world use."),
  pageTitle: bilingual(`${siteConfig.name} - 个人简介`, "Baihao Ye - About Me"),
  university: bilingual("武汉大学", "Wuhan University"),
  greeting: bilingual("你好 👋", "Hello 👋"),
  identity: bilingual("我是", "I'm"),
  heroStatement: bilingual(siteConfig.heroStatement, "Always believe that something wonderful is about to happen."),
  githubHome: bilingual("GitHub 主页 ↗", "GitHub Profile ↗"),
  blog: bilingual("我的博客", "My Blog"),
  resume: bilingual("我的简历", "My Resume"),
  portrait: bilingual(`${siteConfig.name}的职业头像`, "Portrait of Baihao Ye"),
  nav: {
    about: bilingual("关于", "About"),
    projects: bilingual("我的项目", "Projects"),
    opensource: bilingual("开源贡献", "Open Source"),
    books: bilingual("书籍", "Books"),
  },
  headings: {
    about: bilingual("关于我", "About Me"),
    projects: bilingual("我的项目", "My Projects"),
    opensource: bilingual("开源贡献", "Open Source"),
    books: bilingual("书籍推荐", "Recommended Books"),
  },
  about: [
    bilingual(siteConfig.about[0], "I'm a software developer working mainly on AI applications and backend systems. Much of my work has focused on AI in education, exploring practical uses of large language models in teaching and learning. I care about whether these tools fit into everyday teaching, reduce repetitive work for teachers, and give students more targeted support."),
    bilingual(siteConfig.about[1], "I started in Java backend development, writing code line by line. These days, Vibe Coding is part of my daily workflow. I spend more time on architecture, clarifying system structure and module boundaries before working with AI on the implementation."),
    bilingual(siteConfig.about[2], "Outside work, I enjoy swimming, reading, and photography. I also browse technical blogs and official documentation to try new tools and approaches. I like turning ideas into useful products with AI and solving problems I encounter in everyday life."),
  ],
  capabilityGroups: [bilingual(siteConfig.capabilityGroups[0].name, "Frontend"), bilingual(siteConfig.capabilityGroups[1].name, "Backend"), bilingual(siteConfig.capabilityGroups[2].name, "DevOps & Databases"), bilingual(siteConfig.capabilityGroups[3].name, "AI")],
  project: {
    name: bilingual(`${siteConfig.knowWhere.chineseName} / ${siteConfig.knowWhere.name}`, "KnowWhere"),
    label: bilingual(siteConfig.knowWhere.label, "Feishu Bot · AI Knowledge Archiving · Self-hosted"),
    tagline: bilingual(siteConfig.knowWhere.tagline, "Turn scattered links into your own knowledge base."),
    summary: bilingual(siteConfig.knowWhere.summary, "Send an article, GitHub repository, image post, or video link to the Feishu bot. KnowWhere extracts the content, generates categories, summaries, and key insights, and archives them in Feishu Bitable. Original links, full text, and transcripts stay together with reading status and notes, making saved content easier to revisit and digest."),
    sourcesLabel: bilingual("支持来源：", "Supported sources: "),
    sources: bilingual(`${siteConfig.knowWhere.sources.join("、")}。`, "WeChat Official Accounts, Juejin, GitHub, Xiaohongshu, Douyin, and Bilibili."),
    website: bilingual("查看项目 ↗", "View Project ↗"),
    repo: bilingual("GitHub 源码 ↗", "Source on GitHub ↗"),
    flow: bilingual("从链接到知识库", "From Link to Knowledge Base"),
    flowLabel: bilingual("知归内容归档流程", "KnowWhere content archiving workflow"),
    steps: [
      { title: bilingual(siteConfig.knowWhere.steps[0].title, "Send a Link"), description: bilingual(siteConfig.knowWhere.steps[0].description, "Send a public content link in a Feishu chat") },
      { title: bilingual(siteConfig.knowWhere.steps[1].title, "Extract Content"), description: bilingual(siteConfig.knowWhere.steps[1].description, "Extract text, image posts, or video audio") },
      { title: bilingual(siteConfig.knowWhere.steps[2].title, "Classify and Summarize"), description: bilingual(siteConfig.knowWhere.steps[2].description, "Generate categories, summaries, and key insights with AI") },
      { title: bilingual(siteConfig.knowWhere.steps[3].title, "Archive in Feishu"), description: bilingual(siteConfig.knowWhere.steps[3].description, "Save to Bitable to keep reading and taking notes") },
    ],
    screenshot: bilingual("知归飞书多维表格实际归档界面，展示平台、分类、摘要与阅读状态", "The actual KnowWhere archive in Feishu Bitable, showing platforms, categories, summaries, and reading status"),
    caption: bilingual("飞书多维表格实际归档效果", "Actual archive in Feishu Bitable"),
    navigation: bilingual("项目导航", "Project navigation"),
    jump: bilingual(`跳转到${siteConfig.knowWhere.chineseName} / ${siteConfig.knowWhere.name}`, "Jump to KnowWhere"),
  },
  openSource: bilingual(siteConfig.openSource.description, "Making promises for now. Contributions will come."),
  books: {
    intro: bilingual(siteConfig.books.intro, "As long as I keep reading, I can always understand my own pain, always confront ignorance, narrowness, prejudice, and darkness, and take on and dismantle them."),
    author: bilingual(siteConfig.books.introAuthor, "Albert Camus"),
    label: bilingual("推荐书架", "Recommended bookshelf"),
  },
};

// 英文详情与原版书脊分离，不将封面原文误当成英文译名。
const englishBooks = [
  { title: "Asking the Right Questions", authors: "M. Neil Browne / Stuart M. Keeley", category: "Critical Thinking", description: "An introduction to critical thinking that starts with issues, conclusions, reasons, and evidence. It helps you spot hidden assumptions, ambiguous wording, and flaws in reasoning. When reading an article, following the news, or hearing an opinion, question the reliability of the evidence and consider other explanations before making a judgment." },
  { title: "Thinking, Fast and Slow", authors: "Daniel Kahneman", category: "Cognition & Decision-making", description: "Kahneman uses two modes of thinking, fast and slow, to explain how intuition and reason shape our judgments. Through cognitive biases, loss aversion, and overconfidence, he explores common errors in decision-making and the limits of intuition." },
  { title: "The Almanack of Naval Ravikant", authors: "Compiled and written by Eric Jorgenson", category: "Wealth & Happiness", description: "Eric Jorgenson brings together Naval Ravikant's interviews, writing, and public reflections on wealth and happiness. The book explores specific knowledge, long-term thinking, judgment, and inner peace. It reads more like a collection of ideas to revisit than a universal formula for success." },
  { title: "Decisive Moments in History", authors: "Stefan Zweig", category: "History & Literature", description: "Zweig portrays pivotal moments in history with a literary touch, weaving together personal choices, chance, and fate. Through exploration, creation, war, and upheaval, he shows how brief moments can change the course of individual lives and the world." },
  { title: "Selected Works of Mao Tse-tung", authors: "Mao Tse-tung", category: "Thought & History", description: "A collection of Mao Tse-tung's major writings from different periods of the Chinese revolution, covering philosophy, politics, military affairs, and work with the public. Reading them in their historical context offers insight into his ideas on investigation, practice and knowledge, contradictions, and strategy." },
];

// 与原配置保持相同位置，黑色占位继续为空，不新增虚构内容。
export const bookDetails = siteConfig.books.items.map((book, index) => book ? {
  title: bilingual(book.title, englishBooks[index].title),
  authors: bilingual(book.authors, englishBooks[index].authors),
  category: bilingual(book.category, englishBooks[index].category),
  description: bilingual(book.description, englishBooks[index].description),
} : null);

// 在服务器输出中文属性，并携带英文供客户端原地更新。
export function localizedAttrs<Attribute extends "alt" | "title" | "aria-label" | "content">(attribute: Attribute, text: LocalizedText): Record<Attribute, string> & { "data-i18n-attributes": string } {
  return { [attribute]: text["zh-CN"], "data-i18n-attributes": JSON.stringify({ [attribute]: text }) } as Record<Attribute, string> & { "data-i18n-attributes": string };
}
