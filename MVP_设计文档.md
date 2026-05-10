# 悦动 MVP 设计文档

## 一、产品概述

**产品名称**：悦动  
**版本**：MVP v1.0  
**目标用户**：大学生（18-25岁）  
**核心价值**：通过游戏化和社交契约，让运动变成有趣的冒险，解决"坚持难"问题

**核心痛点解决**：
- 反馈黑洞 → BOSS战系统（可视化战斗反馈）
- 鸽子文化 → 契约小组（虚拟币损失厌恶）
- 枯燥难续 → 可爱宠物养成（情感连接）
- 社恐社障 → 小组内社交（低门槛破冰）

---

## 二、用户故事

### 故事1：单机冒险
```
作为一个想减肥的大学生
我想通过运动来"讨伐怪物"
这样我能获得即时的游戏化反馈，而不是枯燥的数字
```

### 故事2：契约小组
```
作为一个容易放弃的运动者
我想和朋友一起挑战Boss，并设置虚拟币赌注
这样我会因为"怕扣币"而坚持完成运动
```

### 故事3：宠物陪伴
```
作为一个孤独的运动者
我想养一只可爱的虚拟宠物
这样我会因为"舍不得它饿"而每天坚持运动
```

---

## 三、MVP核心功能

### 3.1 BOSS战·单机模式

**功能描述**：
- 用户每日可选择一个"怪物"进行挑战
- 怪物血量 = 运动消耗卡路里
- 运动过程中，每消耗10kcal，怪物掉血并有特效
- 怪物死亡后，获得虚拟币和装备碎片

**怪物库设计**：
```
日常怪物（可重复挑战）：
- 脂肪兽（100kcal）- 绿色，圆润可爱
- 懒癌小妖（50kcal）- 紫色，蜷缩状
- 暴食魔（150kcal）- 红色，贪吃状

周Boss（每周一次）：
- 周末大魔王（500kcal）- 蓝色，威武状

月Boss（每月一次）：
- 期末大魔王（1000kcal）- 金色，超威武状
```

**战斗流程**：
1. 用户选择怪物 → 进入战斗界面
2. 用户开始运动 → 手动输入卡路里或自动同步
3. 每输入10kcal → 怪物掉血10%，播放特效
4. 怪物血量为0 → 战斗胜利，获得奖励
5. 奖励：虚拟币（血量的10%）+ 装备碎片（1-3个）

**UI设计**：
- 怪物形象占屏幕中央（大、可爱、有表情变化）
- 血条在怪物上方
- 下方显示"已消耗XXkcal / 需要XXXkcal"
- 每次掉血时有"暴击"特效和数字飘出

---

### 3.2 契约小组

**功能描述**：
- 2-4人组队挑战巨型Boss
- 每人缴纳虚拟币作为"契约金"
- 全员完成则返还并翻倍奖励
- 有人未完成，虚拟币被完成者瓜分

**小组创建流程**：
1. 用户点击"创建小组" → 选择Boss难度
2. 输入小组名称、目标卡路里、截止时间
3. 生成邀请码 → 邀请朋友加入
4. 每人缴纳虚拟币（初始10币）
5. 人数满或时间到 → 小组开始

**小组规则**：
```
难度设置：
- 简单（300kcal/人）→ 每人缴纳5币
- 中等（500kcal/人）→ 每人缴纳10币
- 困难（800kcal/人）→ 每人缴纳20币

完成规则：
- 全员完成 → 每人获得缴纳币的2倍 + 额外50币奖励
- 3人完成，1人未完成 → 完成者瓜分未完成者的币
- 部分完成 → 按完成度分配（完成度越高，获得越多）

时间限制：
- 小组创建后7天内必须完成
- 超时自动结算
```

**小组内社交**：
- 小组内聊天（鼓励、打卡分享）
- 实时进度显示（谁完成了多少%）
- 完成后可以给队友点赞/评论

---

### 3.3 可爱宠物系统

**宠物初始化**：
```
用户首次登录 → 创建宠物
- 输入宠物名字
- 选择性格（活泼/温柔/调皮/懒散）
- 选择性别（男/女/不确定）
- 选择初始形态（3种可爱的懒虫形象）
```

**宠物进化系统**：
```
初始形态：懒懒虫（蜷缩、无神、虚弱）
  ↓ 运动100kcal
第一进化：小兔子（竖起耳朵、眼睛发亮、活力满满）
  ↓ 运动300kcal
第二进化：小鹿（长出小角、会蹦跳、超活泼）
  ↓ 运动600kcal
最终形态：闪闪兔（发光、会飞、超治愈）
```

**宠物互动**：
- 点击宠物 → 做出反应（伸懒腰、摇尾巴、眨眼睛）
- 运动后 → 宠物欢呼雀跃、跳舞庆祝
- 24小时不运动 → 宠物变虚弱、发出求救信号

**宠物装扮**：
- 运动掉落装备（头带、跑鞋皮肤、汗巾等）
- 用户可以给宠物穿衣服
- 同一只宠物可以有多套装扮方案
- 装扮后宠物形象会改变

**宠物信任度**：
```
信任度机制：
- 每次运动 +5信任度
- 每次给宠物穿衣服 +2信任度
- 24小时不运动 -10信任度
- 信任度低于20% → 宠物会"离家出走"（需要重新获得）

显示方式：
- 宠物头上显示信任度条
- 信任度高 → 宠物表情开心
- 信任度低 → 宠物表情难过
```

---

## 四、数据模型

### 用户表（users）
```
id: UUID
username: string
email: string
avatar: string
created_at: timestamp
updated_at: timestamp
```

### 宠物表（pets）
```
id: UUID
user_id: UUID (FK)
name: string
personality: enum (active/gentle/naughty/lazy)
gender: enum (male/female/unknown)
current_form: enum (lazy_bug/rabbit/deer/shiny_rabbit)
trust_level: int (0-100)
total_kcal: int
created_at: timestamp
updated_at: timestamp
```

### 怪物表（monsters）
```
id: UUID
name: string
type: enum (daily/weekly/monthly)
required_kcal: int
reward_coins: int
reward_fragments: int
image_url: string
description: string
```

### 战斗记录表（battles）
```
id: UUID
user_id: UUID (FK)
monster_id: UUID (FK)
pet_id: UUID (FK)
kcal_consumed: int
coins_earned: int
fragments_earned: int
status: enum (in_progress/completed/failed)
started_at: timestamp
completed_at: timestamp
```

### 小组表（groups）
```
id: UUID
creator_id: UUID (FK)
name: string
difficulty: enum (easy/medium/hard)
required_kcal_per_person: int
coins_per_person: int
max_members: int
created_at: timestamp
deadline: timestamp
status: enum (recruiting/in_progress/completed)
```

### 小组成员表（group_members）
```
id: UUID
group_id: UUID (FK)
user_id: UUID (FK)
kcal_completed: int
status: enum (pending/completed/failed)
joined_at: timestamp
completed_at: timestamp
```

### 装备表（equipment）
```
id: UUID
name: string
type: enum (headband/shoes/towel/etc)
rarity: enum (common/rare/epic)
image_url: string
```

### 用户装备表（user_equipment）
```
id: UUID
user_id: UUID (FK)
equipment_id: UUID (FK)
quantity: int
equipped_on_pet: boolean
```

---

## 五、API设计

### 认证相关
```
POST /api/auth/register - 注册
POST /api/auth/login - 登录
POST /api/auth/logout - 登出
```

### 宠物相关
```
GET /api/pets/:id - 获取宠物信息
POST /api/pets - 创建宠物
PUT /api/pets/:id - 更新宠物（穿衣服等）
GET /api/pets/:id/equipment - 获取宠物装备
```

### 战斗相关
```
GET /api/monsters - 获取怪物列表
POST /api/battles - 开始战斗
PUT /api/battles/:id - 更新战斗进度（输入卡路里）
GET /api/battles/:id - 获取战斗详情
```

### 小组相关
```
POST /api/groups - 创建小组
GET /api/groups/:id - 获取小组详情
POST /api/groups/:id/join - 加入小组
GET /api/groups/:id/members - 获取小组成员
PUT /api/groups/:id/members/:user_id - 更新成员进度
```

### 用户相关
```
GET /api/users/:id - 获取用户信息
GET /api/users/:id/stats - 获取用户统计数据
GET /api/users/:id/inventory - 获取用户背包
```

---

## 六、页面流程

### 首页（Dashboard）
```
顶部：用户头像、虚拟币余额
中央：宠物大形象（可点击互动）
下方：
  - "开始冒险"按钮 → 选择怪物
  - "创建小组"按钮 → 创建小组
  - "我的小组"标签 → 查看进行中的小组
  - "背包"标签 → 查看装备
```

### 怪物选择页
```
显示所有可用怪物：
- 日常怪物（可重复）
- 周Boss（本周可用）
- 月Boss（本月可用）

每个怪物显示：
- 怪物形象
- 怪物名称
- 所需卡路里
- 奖励虚拟币
- "挑战"按钮
```

### 战斗页
```
顶部：怪物名称、血条
中央：怪物大形象（有动画）
下方：
  - "已消耗XXkcal / 需要XXXkcal"
  - "输入卡路里"输入框
  - "同步健康数据"按钮
  - "完成战斗"按钮
```

### 小组创建页
```
1. 选择难度（简单/中等/困难）
2. 输入小组名称
3. 选择截止时间（3天/7天/14天）
4. 显示虚拟币消耗
5. "创建小组"按钮
6. 生成邀请码 → 分享给朋友
```

### 小组详情页
```
顶部：小组名称、进度条（X/Y人完成）
中央：小组成员列表
  - 成员头像
  - 成员名字
  - 完成进度（XXkcal / XXXkcal）
  - 状态（进行中/已完成/未完成）
下方：
  - 小组聊天区域
  - "打卡"按钮（分享运动成果）
```

---

## 七、技术架构

### 前端
```
框架：React 18 + TypeScript
UI库：Ant Design / Material-UI
动画：Framer Motion（战斗特效）
状态管理：Redux Toolkit
HTTP客户端：Axios
```

### 后端
```
框架：Node.js + Express / Python + FastAPI
数据库：PostgreSQL
缓存：Redis（排行榜、实时数据）
消息队列：RabbitMQ（异步任务）
```

### 移动端
```
框架：React Native / Flutter
健康数据接入：
  - iOS: HealthKit
  - Android: Google Fit
```

---

## 八、实现时间表

### 第1周：基础架构
- [ ] 项目初始化、数据库设计
- [ ] 用户认证系统
- [ ] API框架搭建

### 第2周：宠物系统
- [ ] 宠物创建、进化逻辑
- [ ] 宠物UI界面
- [ ] 宠物互动动画

### 第3周：BOSS战系统
- [ ] 怪物库设计
- [ ] 战斗逻辑实现
- [ ] 战斗UI和特效

### 第4周：小组系统
- [ ] 小组创建、加入逻辑
- [ ] 虚拟币分配规则
- [ ] 小组UI界面

### 第5周：集成和测试
- [ ] 全流程集成测试
- [ ] 性能优化
- [ ] Bug修复

### 第6周：上线准备
- [ ] 应用商店上架
- [ ] 服务器部署
- [ ] 监控和告警设置

---

## 九、成功指标

### 用户指标
- DAU（日活用户）> 100
- 平均日运动时长 > 30分钟
- 小组完成率 > 80%
- 宠物信任度平均 > 70%

### 商业指标
- 用户留存率（Day 7）> 40%
- 用户留存率（Day 30）> 20%
- 平均每用户虚拟币消耗 > 50币/周

---

## 十、风险和缓解方案

| 风险 | 影响 | 缓解方案 |
|------|------|---------|
| 用户获取困难 | 冷启动失败 | 校园推广、朋友邀请激励 |
| 数据同步不准 | 用户体验差 | 支持手动输入、多数据源 |
| 服务器成本高 | 烧钱快 | 使用云服务自动扩展 |
| 用户流失快 | 留存率低 | 每周新怪物、季节活动 |

