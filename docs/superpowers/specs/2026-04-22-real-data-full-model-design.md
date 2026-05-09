# Real Data Full Model Design

**Date:** 2026-04-22
**Status:** Approved for spec writing
**Scope:** 将移动端页面上的展示数据与发起约球候选项统一接入数据库，建立可扩展的场馆、场地、可约时段和球局数据模型。

---

## 1. Problem Statement

当前项目的大部分核心页面已经接入 PostgreSQL + Prisma，但仍有两类数据不是完整的真实数据链路：

1. 发起约球页面的候选项仍由前端硬编码提供，包括球馆、时间、水平和人数。
2. 新建球局时仍存在部分后端写死的派生字段，例如主理人信用分、距离展示值、匹配度和聊天线程默认摘要。

这会造成一个不一致状态：用户看到的页面大部分像真实产品，但某些关键交互仍依赖代码常量和占位逻辑，无法支撑后续的小程序发布、场馆扩展和规则升级。

本次设计目标是把这些剩余链路全部切换到数据库驱动，并把数据模型提升到长期可扩展的业务结构。

---

## 2. Goals

本次设计要达成以下目标：

1. 页面上的可见业务数据全部来自数据库，而不是前端硬编码或后端占位值。
2. 发起约球页的球馆、时间、水平、人数候选项全部来自数据库接口。
3. 首页、广场、球局详情、我的、消息、聊天在创建新球局后能看到同一套真实数据结果。
4. 数据模型能支持未来继续扩展场馆管理、球台管理、可约时段、费用与推荐规则，而不需要推翻现有表结构。

---

## 3. Non-Goals

本次不包含以下内容：

1. 多城市地理定位与实时距离计算。
2. 场馆运营后台、排班后台和管理端 UI。
3. 动态价格、支付、退款与结算。
4. 实时 WebSocket 聊天。
5. 复杂推荐系统，只保留当前后端规则计算模式并改为真实输入数据。

---

## 4. Approaches Considered

### Approach A: 继续补丁式修复

只把前端硬编码移到后端常量，接口返回给页面，但不引入新的数据库模型。

优点：改动最小，速度快。

缺点：本质仍不是真实数据，后续扩展球馆、场地、时段时仍要返工。

### Approach B: 字典表 + 保守改造

只新增轻量字典表，保存球馆和候选项，现有 Match 继续沿用。

优点：能满足当前真实数据需求。

缺点：无法自然承接球台、时段、场馆状态等真实业务信息，后续仍会再拆表。

### Approach C: 完整模型，分阶段落地

直接引入长期模型：Venue、VenueCourt、VenueAvailabilitySlot、OptionPreset，并在现有 Match、ChatThread、Message、Review 基础上完成真实数据接线。

优点：一次把数据骨架立住，后续功能扩展顺畅。

缺点：本轮实现复杂度更高，需要控制边界。

### Recommendation

选择 Approach C，并且采用“完整模型、分阶段落地”的实施方式。也就是这次只实现当前页面需要的字段和接口，不提前做运营端和复杂排班逻辑，但数据结构按长期方向建设。

---

## 5. Data Model

### 5.1 Venue

代表球馆本身。

核心字段：

- `id`
- `name`
- `city`
- `address`
- `status`，例如 `active` / `inactive`
- `displayDistanceKm`，当前用于页面展示的默认距离值
- `createdAt`
- `updatedAt`

用途：

- 发起约球页的球馆候选项来源
- 球局详情、首页、广场的场馆数据来源
- 后续扩展地理位置与营业状态的基础实体

### 5.2 VenueCourt

代表球馆内的具体球台或场地。

核心字段：

- `id`
- `venueId`
- `name`
- `status`
- `sortOrder`

用途：

- 为未来支持指定球台、场地可约和运营管理做准备
- 本次页面可暂不直接展示，但建模要落地

### 5.3 VenueAvailabilitySlot

代表某个球馆可被发起球局的时间档。

核心字段：

- `id`
- `venueId`
- `label`
- `startTime`
- `endTime`
- `status`
- `sortOrder`

用途：

- 发起约球页的时间候选项来源
- 后续可扩展为某球台维度的时段管理

### 5.4 OptionPreset

轻量通用字典表，用于保存当前仍适合用字典表达的候选项。

核心字段：

- `id`
- `kind`，取值包括 `level`、`player_count`
- `label`
- `value`
- `sortOrder`
- `status`

用途：

- 发起约球页的水平和人数候选项来源
- 避免这两类选项继续硬编码在前端

### 5.5 Match

保留现有 Match，但增强与 Venue 的关系。

新增或调整字段：

- `venueId`，关联 `Venue`
- 保留 `venueName` 作为冗余快照字段，保证列表和详情查询简单
- `hostCreditScore` 由主理人用户实时写入，不再硬编码
- `distanceKm` 由 `Venue.displayDistanceKm` 写入，不再硬编码
- `matchRate` 由服务端规则计算，不再硬编码

### 5.6 Existing Models Kept

以下模型继续保留，并与新模型衔接：

- `User`
- `MatchApplication`
- `ChatThread`
- `ChatThreadParticipant`
- `Message`
- `Review`

---

## 6. API Design

### 6.1 `GET /match-options`

返回发起约球页所需的全部候选项。

响应结构：

- `venues`: 来自 `Venue`
- `timeSlots`: 来自 `VenueAvailabilitySlot`
- `levels`: 来自 `OptionPreset(kind=level)`
- `playerCounts`: 来自 `OptionPreset(kind=player_count)`

设计原则：

- 前端发局页一次请求拿齐候选项，避免四次独立请求
- 返回顺序由数据库 `sortOrder` 控制
- 只返回 `status=active` 的候选项

### 6.2 `POST /matches`

创建球局时，输入改为基于真实候选项。

请求体需要包含：

- `title`
- `venueId`
- `startTime`
- `level`
- `maxPlayers`
- `city`

后端职责：

- 用 `venueId` 查询 `Venue`
- 写入 `venueName` 快照
- 从主理人 `User.creditScore` 写入 `hostCreditScore`
- 从 `Venue.displayDistanceKm` 写入 `distanceKm`
- 用推荐规则服务计算 `matchRate`
- 新建 `ChatThread` 时生成中文默认摘要，例如 `球局已创建，快来沟通上场安排`

### 6.3 Existing Read APIs

以下接口继续存在，但数据来源升级为真实关联数据：

- `GET /matches`
- `GET /matches/:id`
- `GET /matches/mine`
- `GET /chat-threads`
- `GET /chat-threads/:threadId`

这些接口的响应形状尽量保持不变，降低前端返工成本。

---

## 7. Frontend Design

### 7.1 Create Match Page

`/pages/create-match/index`

改造内容：

- 移除前端硬编码的 `venueOptions`、`timeOptions`、`levelOptions`、`playerOptions`
- 页面初始化时请求 `GET /match-options`
- 用真实接口数据渲染选项列表
- 默认选中数据库返回顺序中的第一组可用选项
- 选项加载失败时展示错误文案和重试入口

### 7.2 Existing Pages

以下页面继续复用原接口，但在数据层面享受真实数据升级：

- 首页：最新推荐球局来自真实 Match + Venue 派生值
- 广场：球局卡片来自真实 Match + Venue
- 球局详情：场馆、时间、人数、主理人信用分来自真实数据
- 我的：我发起的球局来自真实 Match
- 消息与聊天：新建球局后线程摘要与后续消息链路来自真实 ChatThread / Message

---

## 8. Data Flow

### 8.1 发起约球数据流

1. 页面打开，前端请求 `GET /match-options`
2. 后端从 `Venue`、`VenueAvailabilitySlot`、`OptionPreset` 聚合候选项
3. 用户选择球馆、时间、水平、人数
4. 前端调用 `POST /matches`
5. 后端读取 `User` 与 `Venue` 真实数据，计算并写入 `Match`
6. 后端创建 `ChatThread` 和主理人线程成员记录
7. 前端发布成功后跳转到我的页面
8. 我的页面通过 `GET /matches/mine` 看到刚创建的真实球局

### 8.2 列表和详情数据流

1. 首页和广场请求 `GET /matches`
2. 后端从 `Match` 读取真实记录，并返回已写入的场馆快照和派生值
3. 详情页请求 `GET /matches/:id`
4. 聊天页请求 `GET /chat-threads/:threadId` 与消息接口

---

## 9. Error Handling

### Backend

- `venueId` 不存在时返回 404 或业务错误
- 候选项为空时 `/match-options` 返回空数组，不返回假数据
- 创建球局时，如果场馆已停用或时段不可用，返回明确错误文案

### Frontend

- 发起约球页候选项加载失败时展示中文错误提示
- 创建球局失败时继续保留当前选择，允许重试
- 如果候选项为空，展示空态文案，引导用户稍后再试

---

## 10. Testing Strategy

### Backend

需要补充的测试：

1. `/match-options` 能返回 seed 的球馆、时段、水平和人数
2. `POST /matches` 使用真实用户信用分和真实场馆距离
3. 新建球局后自动创建中文线程摘要
4. 停用球馆或无效时段不会被发局页获取或成功创建

### Frontend

需要补充的测试：

1. 发起约球页从接口渲染候选项，而不是依赖本地常量
2. 候选项加载失败时展示错误提示
3. 发布成功后跳转我的页面
4. 我的页面展示新创建球局的真实字段

### Verification

最终验收必须覆盖：

- API e2e
- mobile 单测
- `vue-tsc --noEmit`
- API TypeScript 编译
- `uni build -p h5`
- 如有需要再跑 `uni build -p mp-weixin`

---

## 11. Migration and Seed Plan

需要新增 Prisma migration，内容包括：

- 创建 `Venue`
- 创建 `VenueCourt`
- 创建 `VenueAvailabilitySlot`
- 创建 `OptionPreset`
- 给 `Match` 增加 `venueId`
- 建立外键关系和必要索引

Seed 数据要求：

- 至少 2 个活跃球馆
- 每个球馆至少 2 个可约时段
- 至少 3 个水平选项
- 至少 3 个人数选项
- 现有 seed 球局要补 `venueId`

---

## 12. Rollout Plan

本设计的实现阶段按以下顺序推进：

1. Prisma schema 与 migration
2. seed 数据补齐
3. `/match-options` 后端接口
4. 发起约球页前端接线
5. `POST /matches` 真实派生字段改造
6. 页面回归验证

---

## 13. Risks

1. 现有 Match 数据需要补 `venueId`，迁移时必须提供稳定 seed 和兜底映射。
2. 发起约球页从同步常量改成异步加载后，需要处理默认选中和加载态。
3. 如果后续要做真实地理距离，当前 `displayDistanceKm` 只是过渡方案，但不会阻塞当前页面真实化。

---

## 14. Decision Summary

本次采用“完整模型、分阶段落地”的方案：

- 用数据库承载发局候选项和场馆模型
- 页面展示全部基于数据库接口
- 保留现有页面接口形状，优先降低前端改动范围
- 把剩余写死字段全部替换为真实用户、场馆和规则计算结果

这样可以在当前版本完成“页面全真数据化”，同时为后续微信小程序发布和场馆扩展打下稳定基础。
