# 阶段五：逐文件讲解（用途 + 基本语法）

## `index.html`

### 用途
- 声明页面结构和交互入口。
- 提供 `id` 给 JavaScript 查询节点。

### 语法点
- `<!doctype html>`：HTML5 声明。
- `data-action="..."`：把“动作标识”写在按钮上，JS 里读取 `dataset.action` 做事件委托。
- `aria-live="polite"`：让辅助技术在文本变化时提示用户。

---

## `style.css`

### 用途
- 定义布局、颜色、按钮反馈。
- 通过 `image-rendering: pixelated` 保持像素风。

### 语法点
- `:root { --变量 }`：CSS 变量。
- `@media (max-width: 960px)`：响应式断点。
- `position: fixed`：固定底部状态条。

---

## `src/config.js`

### 用途
- 把可配置参数与枚举集中管理，避免“魔法数字散落”。

### 语法点
- `export const`：ES Module 导出常量。
- 对象字面量：`CONFIG`、`CROP_TYPES`、`TILE_STATE`。

---

## `src/game.js`

### 用途
- 维护全部游戏状态。
- 提供所有规则方法（种、浇、收、买、卖、过天、存读档）。
- 负责画布渲染和 HUD 更新。

### 语法点
- `class FarmGame`：面向对象封装游戏。
- `constructor`：初始化状态。
- 模板字符串 `` `文本 ${变量}` ``：构造 HUD 文本。
- `Array.from`：快速创建二维地图。

---

## `src/main.js`

### 用途
- 绑定事件（键盘 + 按钮）。
- 用 `runAction` 统一执行动作流程。

### 语法点
- `addEventListener`：事件监听。
- 事件委托：只给容器绑一次 `click`，通过 `data-action` 判断哪个按钮。
- 早返回 `return`：减少嵌套、让分支更清晰。

