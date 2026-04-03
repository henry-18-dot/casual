import { CONFIG } from "./config.js"; // 导入配置，读取批量买卖默认值。
import { FarmGame } from "./game.js"; // 导入游戏主类。

const canvas = document.querySelector("#game"); // 获取画布元素。
const hud = document.querySelector("#hud"); // 获取 HUD 容器元素。
const statusBar = document.querySelector("#status-bar"); // 获取底部状态条元素。
const shopPanel = document.querySelector("#shop-panel"); // 获取商店按钮容器。

if (
  !(canvas instanceof HTMLCanvasElement) ||
  !(hud instanceof HTMLDivElement) ||
  !(statusBar instanceof HTMLDivElement) ||
  !(shopPanel instanceof HTMLDivElement)
) {
  throw new Error("页面结构错误：缺少必要节点（#game/#hud/#status-bar/#shop-panel）。"); // 提前失败，避免后续空引用报错难排查。
}

const game = new FarmGame(canvas, hud); // 创建游戏实例并注入依赖。

// 阶段四：统一动作执行器，负责“执行 -> 自动保存 -> 重绘 -> 状态条更新”。
function runAction(action, options = { autoSave: true }) {
  action(); // 先执行具体动作。

  if (options.autoSave) {
    game.save(true); // 关键动作后自动保存。
  }

  game.render(); // 每次动作后重绘。
  statusBar.textContent = game.message; // 同步底部状态条文本。
}

// 阶段四：初始化首帧渲染。
runAction(() => {}, { autoSave: false }); // 首屏只渲染不保存。

// 监听键盘输入，把按键映射为游戏动作。
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase(); // 统一转小写，兼容大小写输入。

  // 移动不算关键状态变更，不触发自动保存。
  if (key === "arrowup" || key === "w") return runAction(() => game.moveCursor(0, -1), { autoSave: false });
  if (key === "arrowdown" || key === "s") return runAction(() => game.moveCursor(0, 1), { autoSave: false });
  if (key === "arrowleft" || key === "a") return runAction(() => game.moveCursor(-1, 0), { autoSave: false });
  if (key === "arrowright" || key === "d") return runAction(() => game.moveCursor(1, 0), { autoSave: false });

  // 作物切换不保存。
  if (key === "1") return runAction(() => game.selectCrop("turnip"), { autoSave: false });
  if (key === "2") return runAction(() => game.selectCrop("corn"), { autoSave: false });

  if (key === "j") return runAction(() => game.till()); // J 锄地。
  if (key === "k") return runAction(() => game.seed()); // K 播种。
  if (key === "l") return runAction(() => game.water()); // L 浇水。
  if (key === "h") return runAction(() => game.harvest()); // H 收获。
  if (key === "b") return runAction(() => game.buySelectedSeeds(1)); // B 买 1 粒种子。
  if (key === "x") return runAction(() => game.sellSelectedCrops(1)); // X 卖 1 个作物。
  if (key === " ") return runAction(() => game.nextDay()); // 空格推进到下一天。

  // 手动存档按钮：只保存不二次自动保存。
  if (key === "p") return runAction(() => game.save(false), { autoSave: false });
  if (key === "o") return runAction(() => game.load(), { autoSave: false });
});

// 阶段四：商店面板点击事件（事件委托，减少多次绑定）。
shopPanel.addEventListener("click", (event) => {
  const target = event.target; // 获取触发事件的元素。
  if (!(target instanceof HTMLButtonElement)) return; // 非按钮点击直接忽略。

  const action = target.dataset.action; // 从 data-action 读取动作名。

  if (action === "select-turnip") return runAction(() => game.selectCrop("turnip"), { autoSave: false });
  if (action === "select-corn") return runAction(() => game.selectCrop("corn"), { autoSave: false });

  if (action === "buy-1") return runAction(() => game.buySelectedSeeds(1));
  if (action === "buy-5") return runAction(() => game.buySelectedSeeds(CONFIG.shopBatchSize));

  if (action === "sell-1") return runAction(() => game.sellSelectedCrops(1));
  if (action === "sell-5") return runAction(() => game.sellSelectedCrops(CONFIG.shopBatchSize));

  if (action === "next-day") return runAction(() => game.nextDay());
  if (action === "save") return runAction(() => game.save(false), { autoSave: false });
  if (action === "load") return runAction(() => game.load(), { autoSave: false });
});
