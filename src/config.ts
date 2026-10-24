export const siteConfig = {
  name: "叶栢浩",
  title: "软件开发工程师 / AI Native / 游泳爱好者",
  description:
    "叶栢浩的个人网站：专注 Context Engineering、RAG、Long-term Memory 与 Agent Runtime，把 Agent 做成可靠、可解释的真实产品。",
  accentColor: "#1d4ed8",
  heroStatement: "永远相信美好的事情即将发生。",
  social: {
    email: "ybh-ybh@qq.com",
    github: "https://github.com/ybh-ybh",
    // 个人博客入口，供首页按钮和手机导航复用。
    blog: "https://ybh-ybh.top",
    douyin: "",
  },
  about: [
    "我是一名软件开发工程师，主要做 AI 应用与后端开发。过去的工作主要围绕 AI + 教育展开，探索大模型在教学与学习场景中的实际应用。我关心这些工具能否融入日常教学，帮助教师减少重复性工作，也让学生获得更有针对性的学习支持。",
    "Java 后端开发起步，也经历过一行行手写代码的“古法编程”。现在，Vibe Coding 已经成为我的日常开发方式，我把更多精力放在架构设计上，理清系统结构和模块边界，再与 AI 协作完成实现。",
    "工作之外，我喜欢游泳、阅读、摄影，也常逛技术博客和官方文档，尝试新的工具与做法。我也喜欢和 AI 一起把想法做成能用的产品，解决日常遇到的问题。",
  ],
  // 关于我下方的技术分类，统一维护展示名称和本地图标。
  capabilityGroups: [
    {
      name: "前端",
      // 从页面基础语言到应用框架和组件库。
      skills: [
        { name: "HTML", icon: "/icons/tech/html.svg" },
        { name: "CSS", icon: "/icons/tech/css.svg" },
        { name: "JavaScript", icon: "/icons/tech/javascript.svg" },
        { name: "Vue", icon: "/icons/tech/vue.svg" },
        { name: "Element Plus", icon: "/icons/tech/element-plus.svg" },
      ],
    },
    {
      name: "后端",
      // 依次展示语言、框架、数据访问、微服务组件和构建工具。
      skills: [
        { name: "Java", icon: "/icons/tech/java.svg" },
        { name: "Python", icon: "/icons/tech/python.svg" },
        { name: "Spring Boot", icon: "/icons/tech/spring-boot.svg" },
        { name: "Spring Cloud", icon: "/icons/tech/spring-cloud.svg" },
        { name: "FastAPI", icon: "/icons/tech/fastapi.svg" },
        { name: "MyBatis-Plus", icon: "/icons/tech/mybatis-plus.svg" },
        { name: "Nacos", icon: "/icons/tech/nacos.png" },
        { name: "Sentinel", icon: "/icons/tech/sentinel.png" },
        { name: "RocketMQ", icon: "/icons/tech/rocketmq.svg" },
        { name: "Maven", icon: "/icons/tech/maven.svg" },
      ],
    },
    {
      name: "运维 & 数据库",
      // 先集中展示数据库、缓存、搜索和对象存储，再展示系统及交付工具。
      skills: [
        { name: "MySQL", icon: "/icons/tech/mysql.svg" },
        { name: "PostgreSQL", icon: "/icons/tech/postgresql.svg" },
        { name: "MongoDB", icon: "/icons/tech/mongodb.svg" },
        { name: "Redis", icon: "/icons/tech/redis.svg" },
        { name: "Elasticsearch", icon: "/icons/tech/elasticsearch.svg" },
        { name: "MinIO", icon: "/icons/tech/minio.svg" },
        { name: "Linux", icon: "/icons/tech/linux.svg" },
        { name: "Docker", icon: "/icons/tech/docker.svg" },
        { name: "Nginx", icon: "/icons/tech/nginx.svg" },
        { name: "Git", icon: "/icons/tech/git.svg" },
        { name: "Jenkins", icon: "/icons/tech/jenkins.svg" },
      ],
    },
    {
      name: "AI",
      // 依次展示编排框架、文档解析和 AI 编程工具。
      skills: [
        { name: "LangChain", icon: "/icons/tech/langchain.svg" },
        { name: "LangGraph", icon: "/icons/tech/langgraph.svg" },
        { name: "MinerU", icon: "/icons/tech/mineru.svg" },
        { name: "Codex", icon: "/icons/tech/codex.svg" },
        { name: "OpenCode", icon: "/icons/tech/opencode.svg" },
        { name: "DeepSeek Harness", icon: "/icons/tech/deepseek-harness.svg" },
      ],
    },
  ],
  // 知归首页项目简介，统一维护产品文案、流程和外部入口。
  knowWhere: {
    name: "KnowWhere",
    chineseName: "知归",
    label: "飞书机器人 · AI 知识归档 · 自托管",
    tagline: "把散落的内容链接，整理成自己的知识库。",
    summary:
      "把文章、GitHub 仓库或图文视频链接发给飞书机器人，知归会自动提取内容，生成分类、摘要与关键观点，并归档到飞书多维表格。保留原始链接、正文或转录，配合阅读状态和笔记，让收藏更方便回顾和消化。",
    sources: ["微信公众号", "掘金", "GitHub", "小红书", "抖音", "B站"],
    website: "https://ybh-ybh.github.io/know-where/",
    repo: "https://github.com/ybh-ybh/know-where",
    steps: [
      { title: "发送链接", description: "在飞书私聊发送公开内容链接" },
      { title: "提取内容", description: "提取正文、图文或视频语音" },
      { title: "AI 分类总结", description: "生成分类、摘要与关键观点" },
      { title: "飞书归档", description: "保存到多维表格，继续阅读和记录笔记" },
    ],
  },
  /* WhisperKit 贡献模板：复用时替换下方占位配置，并恢复 OpenSource.astro 中的模板卡片。
  openSource: {
    frameworkIntro:
      "Argmax 开源的 Apple 端侧语音识别框架，基于 Swift / Core ML 提供语音转文字和词级时间戳。",
    impactFacts: ["6.3k+ GitHub stars", "ICML 2025"],
    name: "修复中文词级时间戳",
    description:
      "开发 AirTrim 时，我定位到 BCP-47 与 ISO 639-1 语言代码不匹配导致的中文词级时间戳错乱，完成归一化修复和简繁中文回归测试。修复随 v1.1.0 发布。",
    airTrimLink: "https://github.com/ybh-ybh/AirTrim",
    prLink: "https://github.com/argmaxinc/argmax-oss-swift/pull/511",
    repoLink: "https://github.com/argmaxinc/argmax-oss-swift",
  },
  */
  // 当前展示的开源贡献占位内容。
  openSource: {
    description: "先画饼，以后会有的",
  },
  // 书架保留十个位置，空位不显示虚构书名或介绍。
  books: {
    intro: "只要我还一直读书，我就能够一直理解自己的痛苦，一直与自己的无知、狭隘、偏见、阴暗，见招拆招。",
    // 引言署名单独维护，便于在正文下方右对齐。
    introAuthor: "加缪",
    items: [
      {
        title: "学会提问",
        spineAuthor: "尼尔·布朗",
        // 参考用户提供的封面制作本地矢量书脊，窄屏也能清晰展示。
        spineArtwork: "/books/asking-right-questions-spine.svg",
        spineEnglishTitle: "Asking the Right Questions",
        spinePublisher: ["机械工业", "出版社"],
        authors: "M. 尼尔·布朗 / 斯图尔特·基利",
        category: "批判性思维",
        description:
          "一本批判性思维入门书，从论题、结论、理由和证据出发，帮助你识别隐藏的假设、含混的表达与推理漏洞。读文章、看新闻或听取观点时，先追问证据是否可靠、有没有其他解释，再作判断。",
      },
      {
        title: "思考，快与慢",
        spineAuthor: "卡尼曼",
        spineArtwork: "/books/thinking-fast-and-slow-spine.svg",
        spineEnglishTitle: "Thinking, Fast and Slow",
        spineVariant: "thinking" as const,
        spineInk: "#171717",
        spineMutedInk: "#55575a",
        authors: "丹尼尔·卡尼曼",
        category: "认知与决策",
        description:
          "卡尼曼用“快思考”和“慢思考”两种模式，解释直觉与理性如何共同影响判断。通过认知偏差、损失厌恶与过度自信等例子，帮助我们理解决策中的常见误区，也更清楚地认识直觉的边界。",
      },
      {
        title: "纳瓦尔宝典",
        spineAuthor: "乔根森",
        spineArtwork: "/books/almanack-of-naval-spine.svg",
        spineEnglishTitle: "The Almanack of Naval Ravikant",
        spineVariant: "naval" as const,
        spineSubtitle: "财富与幸福指南",
        spineInk: "#bd8731",
        spineMutedInk: "#41434a",
        authors: "埃里克·乔根森 编著",
        category: "财富与幸福",
        description:
          "埃里克·乔根森整理纳瓦尔的访谈、文章与公开分享，围绕财富与幸福展开，讨论专长、长期主义、判断力以及内在平静。它更像一本可以反复翻阅的思考笔记，而非一套人人适用的成功公式。",
      },
      {
        title: "人类群星闪耀时",
        spineAuthor: "茨威格",
        spineArtwork: "/books/decisive-moments-spine.svg",
        spineEnglishTitle: "Sternstunden der Menschheit",
        spineVariant: "history" as const,
        spineSubtitle: "十四篇历史特写",
        spineInk: "#e4d5c1",
        spineMutedInk: "#c9c2b7",
        authors: "斯蒂芬·茨威格",
        category: "历史与文学",
        description:
          "茨威格以文学笔触描绘历史中的关键时刻，把人物的抉择、偶然与命运交织在一起。从探索、创造到战争与变局，呈现某些短暂瞬间如何改变个人乃至世界的走向。",
      },
      {
        title: "毛泽东选集",
        spineAuthor: "毛泽东",
        spineArtwork: "/books/selected-works-mao-spine.svg",
        spineVariant: "mao" as const,
        spineInk: "#201611",
        spineMutedInk: "#3b281b",
        authors: "毛泽东",
        category: "思想与历史",
        description:
          "收录毛泽东在中国革命不同时期的重要著作，涉及哲学、政治、军事与群众工作等主题。结合具体历史背景阅读，可以了解其对调查研究、实践与认识、矛盾分析和战略问题的论述。",
      },
      null,
      null,
      null,
      null,
      null,
    ],
  },
};
