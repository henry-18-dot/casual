# 像素种田经营 2D 小游戏（教学版）

这是一个**纯前端（HTML + CSS + JavaScript）**的最小可玩种田经营原型，目标是帮你理解：

1. 游戏数据结构怎么设计（地图、地块状态、背包、经济参数）
2. 游戏循环怎么形成（输入 -> 更新状态 -> 渲染）
3. 代码如何按文件拆分（配置、逻辑、入口）

---

## 当前阶段：阶段五（系统化教学文档）

阶段四功能保留不变，本阶段重点是“学会读懂代码并自己改”：

- 新增架构文档（整体思路）
- 新增逐文件讲解（用途 + 语法）
- 新增近似逐行讲解（按行区间）

---

## 教学文档入口（阶段五新增）

- `docs/ARCHITECTURE.md`：整体架构与学习路径
- `docs/FILE_BY_FILE_GUIDE.md`：每个文件做什么 + 基础语法
- `docs/LINE_BY_LINE_NOTES.md`：按行区间讲解关键代码

---

## 目录结构

```text
pixel-farm-game/
  index.html
  style.css
  src/
    config.js
    game.js
    main.js
  docs/
    ARCHITECTURE.md
    FILE_BY_FILE_GUIDE.md
    LINE_BY_LINE_NOTES.md
```

---

## 如何运行

```bash
cd pixel-farm-game
python3 -m http.server 8080
```

打开：`http://localhost:8080`

---

## 操作说明（保持阶段四）

- 方向键 / WASD：移动光标
- 1 / 2：切换作物（萝卜 / 玉米）
- J：锄地
- K：播种（消耗当前作物种子）
- L：浇水（当天加速生长）
- 空格：下一天
- H：收获成熟作物（进入背包）
- B：购买当前作物 1 粒种子
- X：卖出当前作物 1 个
- P：手动存档
- O：手动读档
- 或直接点击左侧商店按钮进行批量买卖（x5）

