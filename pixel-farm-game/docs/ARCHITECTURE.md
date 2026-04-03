# 阶段五：架构讲解（教学文档）

> 目标：让你从“能跑起来”升级到“知道为什么这么写”。

---

## 1. 这个小游戏的核心循环

每次玩家输入后，都会经过这四步：

1. **Input（输入）**：键盘或按钮触发事件（`main.js`）
2. **Update（更新）**：调用 `FarmGame` 方法修改状态（`game.js`）
3. **Auto Save（自动保存）**：关键动作后写入 LocalStorage（`main.js` + `game.js`）
4. **Render（渲染）**：重绘 canvas + 更新 HUD 与状态条（`game.js` + `main.js`）

这就是你在很多游戏里都会看到的输入-更新-渲染模型。

---

## 2. 文件分工

- `index.html`
  - 定义页面结构（左侧信息区 + 商店按钮 + 右侧画布 + 底部状态条）
- `style.css`
  - 定义视觉风格（像素化、布局、按钮、状态条）
- `src/config.js`
  - 集中所有配置参数（地图大小、作物参数、批量交易参数）
- `src/game.js`
  - 游戏核心状态与规则（地图、背包、种植逻辑、交易逻辑、存档逻辑、渲染）
- `src/main.js`
  - 事件总线（键盘/按钮 -> 调用 game 方法），并统一管理自动保存流程

---

## 3. 关键数据结构

### 3.1 地图（二维数组）

`map[y][x]` 每个格子都是一个对象：

- `state`: 地块状态（grass/tilled/seeded/ready）
- `cropType`: 当前作物类型（turnip/corn/null）
- `growProgress`: 生长进度
- `watered`: 当天是否浇水

### 3.2 背包（按作物类型分组）

- `inventory.seeds.turnip`
- `inventory.seeds.corn`
- `inventory.crops.turnip`
- `inventory.crops.corn`

这种结构在后续扩展第三种、第四种作物时非常方便。

---

## 4. 阶段五你该掌握什么

1. 能解释 `runAction` 为什么是“单一入口”
2. 能解释 `CROP_TYPES` 为什么叫“参数化设计”
3. 能自己加一种新作物（如番茄）
4. 能自己加一个新动作（如“施肥 +2 生长”）

---

## 5. 推荐练习

1. 在 `CROP_TYPES` 增加 `tomato`
2. 在 `index.html` 增加“选择番茄”按钮
3. 在 `main.js` 增加键位 `3` 绑定番茄
4. 在 `game.js` 验证买卖和成熟颜色是否生效

