# Pingpang — 城市业余约球平台

一个帮助城市业余球友「更快成局、减少爽约、提升复约」的约球平台。围绕「约局广场 + 规则推荐」设计，提供从发起约局到开打反馈的完整闭环。

## 功能概览

| 端 | 技术栈 | 说明 |
|---|---|---|
| **API** | NestJS 11 + Prisma 6 + PostgreSQL 16 + Redis 7 | 核心后端，REST API |
| **Admin SPA** | Vue 3 + Vite + ECharts | 运营后台（数据看板、用户/球馆/球局/评价/举报管理） |
| **Mobile H5** | uni-app (Vue 3) | 移动端 H5，含微信小程序构建目标 |
| **小程序** | uni-app → mp-weixin | 微信小程序客户端 |

### 核心业务闭环

1. **发起约局**：选择球馆（支持高德 POI 搜索 + GCJ-02 坐标）、球台、时段，设置水平与人数
2. **加入约局**：浏览附近球局（按距离排序），报名等待主理人审批
3. **开打反馈**：签到码核销、赛后互相评价（信用体系）
4. **消息沟通**：局内聊天、系统通知、报名审批消息

## 目录结构

```
apps/
  api/         NestJS 后端
  admin/       Vue 管理后台
  mobile/      uni-app H5 + 微信小程序
packages/
  contracts/   共享类型契约
tools/         构建/预览/发布脚本
docs/          产品文档 + 部署指南
```

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 10.8（`corepack enable && corepack prepare pnpm@10.8.0 --activate`）
- PostgreSQL 16 + Redis 7（可用 Docker Compose 一键起）

### 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，至少填 DATABASE_URL 和 REDIS_URL

# 3. 初始化数据库（迁移 + 种子数据）
pnpm --filter @pingpang/api db:migrate:deploy
pnpm --filter @pingpang/api db:seed

# 4. 启动各端（分终端）
pnpm dev:api          # API  -> :3000
pnpm dev:admin        # 后台 -> :8080
pnpm dev:mobile       # H5   -> :8081
```

### Docker Compose（生产演练）

```bash
cp .env.example .env
# 填写 AUTH_TOKEN_SECRET / ADMIN_TOKEN / ALIYUN_SMS_* / 可选 SENTRY_DSN
docker compose --env-file .env up --build
```

- Postgres → `:5432`，Redis → `:6379`，API → `:3000`
- Admin → `:8080`，H5 → `:8081`

> ⚠️ 生产环境必须设置 `NODE_ENV=production`、`ALLOW_DEV_LOGIN=false`、真实的 `SMS_PROVIDER`（如 aliyun）+ 微信凭据，否则 API 会 fail-fast 拒绝启动。

## 环境变量

见 `.env.example`。关键项：

| 变量 | 必须 | 说明 |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL 连接串 |
| `REDIS_URL` | ✅（生产） | Redis 连接串 |
| `AUTH_TOKEN_SECRET` | ✅（生产） | 会话 JWT HMAC 密钥，按环境轮换 |
| `ADMIN_TOKEN` | ✅（生产） | 后台 `X-Admin-Token` 守卫 |
| `ALLOW_DEV_LOGIN` | ✅ | 生产必须为 `false` |
| `SMS_PROVIDER` + `ALIYUN_SMS_*` | ✅（生产） | 短信验证码（生产禁用 log 兜底） |
| `WECHAT_APPID` / `WECHAT_SECRET` | ✅（生产） | 微信小程序登录 |
| `AMAP_KEY` | 可选 | 高德地图反地理编码 / POI 搜索 |
| `SENTRY_DSN` | 可选 | 错误追踪 |

## 测试

```bash
pnpm test                          # 工作区冒烟测试
pnpm --filter @pingpang/api test   # API 单元测试
pnpm --filter @pingpang/api test:e2e  # API 端到端测试（需 DB + Redis）
pnpm --filter @pingpang/admin test
pnpm --filter @pingpang/mobile test
```

CI（`.github/workflows/ci.yml`）在 `ubuntu-latest` 上跑 admin / mobile / api 三路矩阵，覆盖类型检查、单测、e2e 和构建。

## 部署

生产部署前请务必阅读 [`docs/deployment.md`](docs/deployment.md)，其中包含：

- 生产环境变量清单
- 数据库迁移策略（`prisma migrate deploy`，严禁 `db push`）
- 容器构建命令
- Kubernetes 提示（initContainer 跑迁移、健康探针）
- **上线前 checklist**（ICP 备案、微信审核、备份、Sentry 等）

### 关键上线前提（中国大陆）

- **ICP 备案**：生产域名必须备案，服务器必须在中国大陆
- **微信小程序审核**：核心客户端需通过微信审核
- **阿里云短信**：签名 + 模板需实名认证审核
- **隐私政策 + 用户协议**：必须上线

## 架构约定

- **坐标统一 GCJ-02**（火星坐标）：微信 `getLocation({type:'gcj02'})` 与腾讯/高德地图原生返回，后端无需转换；H5 的浏览器 WGS84 在入口处转换。
- **时区**：所有"当天/时段"计算以 `Asia/Shanghai` 为基准（`buildShanghai*` 系列）。
- **安全**：bcrypt（10 轮）+ 防时序枚举、`ThrottlerModule` 限流、helmet 安全头、`ValidationPipe({ whitelist, forbidNonWhitelisted })`。
- **密码哈希不落客户端**：所有面向客户端的 user 查询走 `publicProfileSelect`，`passwordHash` 仅在登录校验时读取。

## License

MIT
