# 智能简历分析与岗位匹配平台

基于 AI 的简历智能解析与岗位精准匹配系统，连接求职者与企业招聘方，大幅提升招聘效率。

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI 组件库**: Ant Design 5
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP 客户端**: Axios

### 后端
- **框架**: Nest.js 10
- **语言**: TypeScript
- **ORM**: TypeORM 0.3
- **数据库**: MySQL 8.0
- **缓存/队列**: Redis 7 + Bull
- **认证**: JWT + Passport
- **API 文档**: Swagger (OpenAPI)

### 基础设施
- **容器化**: Docker Compose
- **数据库初始化**: SQL 脚本

## 项目结构

```
resume-matching-platform/
├── frontend/                 # 前端项目 (React + TypeScript)
│   ├── src/
│   │   ├── api/              # API 请求层
│   │   ├── components/       # 公共组件
│   │   ├── layouts/          # 布局组件
│   │   ├── pages/            # 页面组件
│   │   ├── router/           # 路由配置
│   │   ├── store/            # 状态管理 (Zustand)
│   │   ├── styles/           # 全局样式
│   │   ├── types/            # TypeScript 类型定义
│   │   └── utils/            # 工具函数
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                  # 后端项目 (Nest.js)
│   ├── src/
│   │   ├── common/           # 公共模块 (过滤器、拦截器、实体基类)
│   │   ├── config/           # 配置文件 (TypeORM)
│   │   ├── modules/          # 业务模块
│   │   │   ├── auth/         # 认证模块 (登录、注册、JWT)
│   │   │   ├── users/        # 用户模块
│   │   │   ├── candidates/   # 求职者模块
│   │   │   ├── companies/    # 企业模块
│   │   │   ├── resumes/      # 简历模块 (上传、解析、管理)
│   │   │   ├── jobs/         # 职位模块 (发布、管理)
│   │   │   ├── applications/ # 投递记录模块
│   │   │   ├── matching/     # 智能匹配模块
│   │   │   ├── ai/           # AI 能力模块
│   │   │   └── upload/       # 文件上传模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── docker/                   # Docker 相关
│   └── mysql/
│       └── init/             # 数据库初始化脚本
│           └── 01-init.sql
│
├── docker-compose.yml        # Docker Compose 配置 (MySQL + Redis)
├── package.json              # 根目录 package (concurrently)
├── .env.example              # 环境变量示例
├── .gitignore
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18.x
- npm >= 9.x 或 pnpm / yarn
- Docker & Docker Compose (可选，用于启动 MySQL 和 Redis)

### 1. 启动数据库（使用 Docker）

```bash
# 启动 MySQL 和 Redis
docker-compose up -d

# 查看状态
docker-compose ps

# 停止服务
docker-compose down
```

数据库会自动初始化，创建所有表结构。

### 2. 安装依赖

```bash
# 安装根目录依赖 (用于同时启动前后端)
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置环境变量

```bash
# 后端
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 前端
cd ../frontend
cp .env.example .env
# 编辑 .env 文件
```

### 4. 启动开发服务

**方式一：分别启动**

```bash
# 启动后端 (端口 3000)
cd backend
npm run start:dev

# 启动前端 (端口 5173)
cd frontend
npm run dev
```

**方式二：根目录同时启动**

```bash
# 在项目根目录
npm run dev
```

### 5. 访问地址

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:5173 |
| 后端 API | http://localhost:3000/api |
| Swagger 文档 | http://localhost:3000/api/docs |
| MySQL | localhost:3306 |
| Redis | localhost:6379 |

## 核心模块说明

### 认证模块 (Auth)
- 用户注册 / 登录
- JWT Token 认证
- 角色权限控制 (求职者 / 企业 / 管理员)

### 简历模块 (Resumes)
- 简历文件上传 (PDF / Word / TXT)
- AI 智能解析 (异步队列处理)
- 结构化展示与编辑
- 多版本简历管理
- 默认简历设置

### 职位模块 (Jobs)
- 职位发布与管理
- JD 智能提取
- 职位搜索与筛选
- 浏览量统计

### 智能匹配模块 (Matching)
- 基于向量的语义匹配
- 多维评分 (技能/经验/学历/地点/薪资)
- 可解释的匹配理由
- 求职者端岗位推荐
- 企业端候选人推荐

### AI 模块 (AI)
- 简历结构化解析
- JD 要求提取
- 简历优化建议生成
- 匹配理由生成
- 文本向量化

### 投递模块 (Applications)
- 一键投递
- 投递状态追踪
- 面试邀约管理
- 招聘漏斗统计

## 数据库设计

主要数据表：
- `users` - 用户表
- `candidates` - 求职者信息表
- `companies` - 企业信息表
- `resumes` - 简历表
- `work_experiences` - 工作经历表
- `educations` - 教育经历表
- `projects` - 项目经历表
- `jobs` - 职位表
- `applications` - 投递记录表
- `interviews` - 面试邀约表

## 开发指南

### 后端开发

```bash
# 进入后端目录
cd backend

# 开发模式 (热更新)
npm run start:dev

# 构建
npm run build

# 生产模式
npm run start:prod

# 代码检查
npm run lint
```

### 前端开发

```bash
# 进入前端目录
cd frontend

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

### 路径别名

**后端 (Nest.js)**
- `@/*` → `src/*`
- `@common/*` → `src/common/*`
- `@config/*` → `src/config/*`
- `@modules/*` → `src/modules/*`

**前端 (Vite)**
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@api/*` → `src/api/*`
- `@store/*` → `src/store/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`

## 环境变量说明

### 后端环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| DB_HOST | 数据库地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_DATABASE | 数据库名 | resume_match |
| DB_USERNAME | 数据库用户 | resume_user |
| DB_PASSWORD | 数据库密码 | resume123456 |
| REDIS_HOST | Redis 地址 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| REDIS_PASSWORD | Redis 密码 | redis123456 |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | Token 有效期 | 7d |
| API_PREFIX | API 前缀 | /api |
| AI_PROVIDER | AI 服务提供商 | openai |
| AI_API_KEY | AI API Key | - |
| AI_MODEL | AI 模型 | gpt-3.5-turbo |

### 前端环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| VITE_API_BASE_URL | API 基础路径 | /api |
| VITE_APP_TITLE | 应用标题 | 智能简历匹配平台 |

## License

MIT
