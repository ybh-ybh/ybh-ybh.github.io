# 技术栈图标来源

获取日期：2026-10-24。图标随网站本地发布，页面不请求第三方图标服务。

| 本地文件 | 技术 | 来源 |
| --- | --- | --- |
| `vue.svg` | Vue | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg) |
| `element-plus.svg` | Element Plus | [官方图标](https://element-plus.org/images/element-plus-logo-small.svg) |
| `html.svg` | HTML | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg) |
| `css.svg` | CSS | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg) |
| `javascript.svg` | JavaScript | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg) |
| `java.svg` | Java | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg) |
| `spring-boot.svg` | Spring Boot | [官方项目图标](https://spring.io/img/projects/spring-boot.svg) |
| `spring-cloud.svg` | Spring Cloud | [官方项目图标](https://spring.io/img/projects/spring-cloud.svg) |
| `maven.svg` | Maven | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/maven/maven-original.svg) |
| `mybatis-plus.svg` | MyBatis-Plus | [官方图标](https://baomidou.com/favicon.svg) |
| `nacos.png` | Nacos | [官网使用的 80×80 图标](https://img.alicdn.com/imgextra/i3/O1CN01GdSxST24NB7Yl5Pdx_%21%216000000007378-2-tps-80-80.png) |
| `sentinel.png` | Sentinel | [Nacos 官网生态展示的 80×80 图标](https://img.alicdn.com/imgextra/i2/O1CN01bbN4uH1OXyb3Upgcg_%21%216000000001716-2-tps-80-80.png) |
| `rocketmq.svg` | RocketMQ | [Simple Icons](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/apacherocketmq.svg) |
| `python.svg` | Python | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg) |
| `fastapi.svg` | FastAPI | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg) |
| `mysql.svg` | MySQL | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg) |
| `docker.svg` | Docker | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg) |
| `nginx.svg` | Nginx | [Simple Icons](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nginx.svg) |
| `redis.svg` | Redis | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg) |
| `mongodb.svg` | MongoDB | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg) |
| `elasticsearch.svg` | Elasticsearch | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/elasticsearch/elasticsearch-original.svg) |
| `postgresql.svg` | PostgreSQL | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg) |
| `git.svg` | Git | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg) |
| `linux.svg` | Linux | [gilbarbara/logos 彩色 Tux](https://raw.githubusercontent.com/gilbarbara/logos/main/logos/linux-tux.svg) |
| `jenkins.svg` | Jenkins | [Devicon](https://raw.githubusercontent.com/devicons/devicon/master/icons/jenkins/jenkins-original.svg) |
| `minio.svg` | MinIO | [Simple Icons](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/minio.svg) |
| `codex.svg` | Codex | [Lobe Icons](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/codex.svg) |
| `opencode.svg` | OpenCode | [Lobe Icons](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/opencode.svg) |
| `deepseek-harness.svg` | DeepSeek Harness | [官方图标](https://www.deepseek.com/harness/favicon.svg) |
| `langchain.svg` | LangChain | [Lobe Icons](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/langchain.svg) |
| `langgraph.svg` | LangGraph | [Lobe Icons](https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/langgraph.svg) |
| `mineru.svg` | MinerU | [官网品牌标识](https://webpub.shlab.tech/MinerU/static/image/mineru-logo.svg) |

Devicon 与 Lobe Icons 的 MIT 许可文本分别保存在 `LICENSE-devicon.txt` 和 `LICENSE-lobe-icons.txt`。Simple Icons 图形采用 [CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md)。品牌名称和商标仍归各自权利人所有，本站仅用于说明个人接触过的技术，不表示官方关联或背书。

## 本地处理

- `deepseek-harness.svg` 保留官方图形路径，固定使用官方基础品牌蓝 `#4D6BFE`，去除 favicon 专用的系统明暗模式媒体查询，确保浅色页面在系统深色模式下仍清晰。
- `linux.svg` 选用约 18 KB 的彩色 Tux 原始素材，避免采用约 194 KB 的 Devicon 彩色版本；保留原始图形与比例。
- `mineru.svg` 来自 MinerU 官网使用的 SVG 标识，将视窗从 `0 0 125 32` 收紧为 `0 0 32 32`，显示左侧独立图形并隐藏右侧字标；保留全部官方路径与配色。
- `nginx.svg` 使用紧凑的独立标志，保留 Simple Icons 原始路径，设置品牌绿色 `#009639`。
- 其他图标保持下载的原始内容，未裁剪或重绘。
