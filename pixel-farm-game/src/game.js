import { CONFIG, CROP_TYPES, TILE_STATE } from "./config.js"; // 导入配置、作物表和状态枚举。

// 定义游戏主类：把状态、逻辑、渲染都组织在一个对象里，便于初学者理解。
export class FarmGame {
  constructor(canvas, hud) {
    this.canvas = canvas; // 保存 canvas 元素引用，后面用于绘图。
    this.ctx = canvas.getContext("2d"); // 获取 2D 绘图上下文。
    this.hud = hud; // 保存 HUD 容器引用，后面用于写文本。

    this.day = 1; // 当前是第几天，从 1 开始更符合直觉。
    this.gold = CONFIG.startGold; // 当前金币，初始值来自配置。
    this.message = "欢迎来到阶段四！现在有可视化商店和批量买卖。"; // 屏幕提示语。

    this.selectedCrop = "turnip"; // 当前选中的种子类型，数字键可切换。

    // 阶段三：背包改成“按作物类型分组”的结构。
    this.inventory = {
      seeds: this.createInitialSeedBag(), // 各类型种子数量。
      crops: this.createEmptyCropBag(), // 各类型作物数量。
    };

    this.cursor = { x: 0, y: 0 }; // 光标位置（格子坐标），用于选择地块。
    this.map = this.createInitialMap(); // 初始化 10x10 地图数据。

    this.tryLoad(); // 构造完成后尝试读档。
  }

  // 创建初始种子背包：按 CROP_TYPES 里的 startSeeds 初始化。
  createInitialSeedBag() {
    return Object.fromEntries(
      Object.entries(CROP_TYPES).map(([cropKey, crop]) => [cropKey, crop.startSeeds])
    );
  }

  // 创建空作物背包：所有作物数量从 0 开始。
  createEmptyCropBag() {
    return Object.fromEntries(Object.keys(CROP_TYPES).map((cropKey) => [cropKey, 0]));
  }

  // 创建初始地图：每个格子都是草地，且没有作物进度。
  createInitialMap() {
    return Array.from({ length: CONFIG.mapRows }, () =>
      Array.from({ length: CONFIG.mapCols }, () => ({
        state: TILE_STATE.GRASS, // 初始状态统一为草地。
        cropType: null, // 当前格子种的是哪类作物；空地时为 null。
        growProgress: 0, // 生长进度（天数）初始为 0。
        watered: false, // 是否浇水初始为 false。
      }))
    );
  }

  // 获取当前选中作物的配置对象，避免多处重复索引。
  getSelectedCropConfig() {
    return CROP_TYPES[this.selectedCrop];
  }

  // 工具方法：拿到当前光标所在的地块对象。
  getCurrentTile() {
    return this.map[this.cursor.y][this.cursor.x];
  }

  // 工具方法：给种子背包加减数量，并做上下限限制。
  addSeed(cropKey, amount) {
    const nextValue = this.inventory.seeds[cropKey] + amount; // 先算变化后的值。
    this.inventory.seeds[cropKey] = Math.min(CONFIG.inventoryMax, Math.max(0, nextValue)); // 限制范围到 [0, max]。
  }

  // 工具方法：给作物背包加减数量，并做上下限限制。
  addCrop(cropKey, amount) {
    const nextValue = this.inventory.crops[cropKey] + amount; // 先算变化后的值。
    this.inventory.crops[cropKey] = Math.min(CONFIG.inventoryMax, Math.max(0, nextValue)); // 限制范围到 [0, max]。
  }

  // 切换当前选中作物类型（例如按 1/2 或点商店按钮）。
  selectCrop(cropKey) {
    if (!CROP_TYPES[cropKey]) {
      this.message = "未知作物类型。"; // 防御式判断。
      return; // 结束。
    }

    this.selectedCrop = cropKey; // 更新当前选中项。
    this.message = `已切换到 ${CROP_TYPES[cropKey].label}。`; // 给出反馈。
  }

  // 移动光标（而不是移动角色），dx/dy 是 -1/0/1。
  moveCursor(dx, dy) {
    const maxX = CONFIG.mapCols - 1; // 最大合法 X 索引。
    const maxY = CONFIG.mapRows - 1; // 最大合法 Y 索引。

    this.cursor.x = Math.min(maxX, Math.max(0, this.cursor.x + dx)); // 把 x 限制在 [0,maxX]。
    this.cursor.y = Math.min(maxY, Math.max(0, this.cursor.y + dy)); // 把 y 限制在 [0,maxY]。
  }

  // 行为 1：锄地，把草地变成耕地。
  till() {
    const tile = this.getCurrentTile(); // 获取当前格子。

    if (tile.state !== TILE_STATE.GRASS) {
      this.message = "这块地已经不是草地了，不能再锄。"; // 非草地不给重复锄。
      return; // 直接结束。
    }

    tile.state = TILE_STATE.TILLED; // 状态变更：grass -> tilled。
    tile.cropType = null; // 耕地还未播种，不应带作物类型。
    tile.watered = false; // 重置浇水标记（安全起见）。
    tile.growProgress = 0; // 重置生长进度。
    this.message = "锄地成功！现在按 K 播种。"; // 更新提示语。
  }

  // 行为 2：播种，只有耕地可以播，且“当前选中作物”的种子要够。
  seed() {
    const tile = this.getCurrentTile(); // 拿到当前格子。
    const crop = this.getSelectedCropConfig(); // 当前选中作物的配置。

    if (tile.state !== TILE_STATE.TILLED) {
      this.message = "只有耕地可以播种（先按 J 锄地）。"; // 状态不对则提示。
      return; // 结束。
    }

    if (this.inventory.seeds[this.selectedCrop] <= 0) {
      this.message = `背包没有${crop.label}种子了，去商店买一点。`; // 种子不足提示。
      return; // 结束。
    }

    this.addSeed(this.selectedCrop, -1); // 消耗 1 粒选中种子。
    tile.state = TILE_STATE.SEEDED; // 状态变更：tilled -> seeded。
    tile.cropType = this.selectedCrop; // 记录这块地种的具体作物类型。
    tile.growProgress = 0; // 生长天数从 0 重新计。
    tile.watered = false; // 播种后默认未浇水。
    this.message = `${crop.label}播种完成，种子 -1。`; // 成功提示。
  }

  // 行为 3：浇水，只有已播种未成熟时才有意义。
  water() {
    const tile = this.getCurrentTile(); // 当前格子。

    if (tile.state !== TILE_STATE.SEEDED) {
      this.message = "只能给已播种作物浇水。"; // 状态不对直接提示。
      return; // 结束。
    }

    if (tile.watered) {
      this.message = "今天这块地已经浇过水了。"; // 防止重复浇水叠加。
      return; // 结束。
    }

    tile.watered = true; // 标记为已浇水，次日结算时生效。
    this.message = "浇水成功！明天会长得更快。"; // 成功提示。
  }

  // 阶段四：计算“当前作物”最多可以买多少（受金币、容量同时限制）。
  getMaxBuyableSeeds(cropKey) {
    const crop = CROP_TYPES[cropKey]; // 取作物配置。
    const byGold = Math.floor(this.gold / crop.seedPrice); // 金币能买的上限。
    const byBag = CONFIG.inventoryMax - this.inventory.seeds[cropKey]; // 背包还能放多少。
    return Math.max(0, Math.min(byGold, byBag)); // 返回两个上限的较小值。
  }

  // 阶段四：购买“当前选中作物”的 N 粒种子（支持批量）。
  buySelectedSeeds(amount) {
    const crop = this.getSelectedCropConfig(); // 当前选中作物配置。
    const maxBuyable = this.getMaxBuyableSeeds(this.selectedCrop); // 当前最多可买数量。
    const actualAmount = Math.min(amount, maxBuyable); // 实际购买数量。

    if (actualAmount <= 0) {
      this.message = "无法购买：可能金币不足或背包已满。"; // 失败统一提示。
      return; // 结束。
    }

    this.gold -= actualAmount * crop.seedPrice; // 批量扣金币。
    this.addSeed(this.selectedCrop, actualAmount); // 批量加种子。
    this.message = `购买${crop.label}种子 ${actualAmount} 粒。`; // 成功提示。
  }

  // 行为 4：收获，仅成熟地块可收获，收获后进入对应作物背包。
  harvest() {
    const tile = this.getCurrentTile(); // 当前格子。

    if (tile.state !== TILE_STATE.READY || !tile.cropType) {
      this.message = "这块地还没成熟，不能收获。"; // 未成熟就不能收。
      return; // 结束。
    }

    if (this.inventory.crops[tile.cropType] >= CONFIG.inventoryMax) {
      this.message = "背包作物已满，请先卖出。"; // 背包满则不能收。
      return; // 结束。
    }

    const crop = CROP_TYPES[tile.cropType]; // 拿到该地块作物类型配置。
    this.addCrop(tile.cropType, 1); // 收获 +1 对应作物。
    tile.state = TILE_STATE.TILLED; // 收获后保留耕地，方便继续播种。
    tile.cropType = null; // 收获后清空作物类型。
    tile.growProgress = 0; // 清空生长进度。
    tile.watered = false; // 清空浇水状态。
    this.message = `收获成功！${crop.label}已放入背包。`; // 反馈信息。
  }

  // 阶段四：卖出“当前选中作物”的 N 个（支持批量）。
  sellSelectedCrops(amount) {
    const crop = this.getSelectedCropConfig(); // 当前选中作物配置。
    const hasAmount = this.inventory.crops[this.selectedCrop]; // 当前作物库存。
    const actualAmount = Math.min(amount, hasAmount); // 实际可卖数量。

    if (actualAmount <= 0) {
      this.message = `背包没有可卖出的${crop.label}。`; // 无货可卖。
      return; // 结束。
    }

    this.addCrop(this.selectedCrop, -actualAmount); // 批量减少背包作物。
    this.gold += actualAmount * crop.sellPrice; // 批量增加金币。
    this.message = `卖出${crop.label} ${actualAmount} 个，获得 ${actualAmount * crop.sellPrice} 金币。`; // 成功提示。
  }

  // 行为 5：进入下一天，统一结算所有已播种作物的生长。
  nextDay() {
    this.day += 1; // 天数 +1。

    for (const row of this.map) {
      for (const tile of row) {
        if (tile.state !== TILE_STATE.SEEDED || !tile.cropType) {
          tile.watered = false; // 非播种地块，浇水标记无意义，统一清空。
          continue; // 跳过后续生长逻辑。
        }

        const crop = CROP_TYPES[tile.cropType]; // 当前格子的作物配置。
        const dailyGrowth = tile.watered ? 1 + CONFIG.waterBonus : 1; // 浇过水则当天多长一点。
        tile.growProgress += dailyGrowth; // 增加生长进度。

        if (tile.growProgress >= crop.growDays) {
          tile.state = TILE_STATE.READY; // 达到各自作物阈值后成熟。
          tile.watered = false; // 成熟后不需要浇水。
        } else {
          tile.watered = false; // 每天结束重置浇水，要求玩家每天操作。
        }
      }
    }

    this.message = `第 ${this.day} 天开始。阶段四支持自动保存（P/O 手动存读档）。`; // 日切提示。
  }

  // 阶段四：手动/自动存档到浏览器 LocalStorage。
  save(isAuto = false) {
    const payload = {
      day: this.day,
      gold: this.gold,
      selectedCrop: this.selectedCrop,
      inventory: this.inventory,
      map: this.map,
    }; // 只保存重建游戏必须的数据。

    localStorage.setItem(CONFIG.saveKey, JSON.stringify(payload)); // 写入本地存储。
    this.message = isAuto ? "已自动保存。" : "存档成功（当前浏览器本地）。"; // 根据来源给不同提示。
  }

  // 阶段四：手动读档并恢复状态。
  load() {
    const raw = localStorage.getItem(CONFIG.saveKey); // 读取原始字符串。
    if (!raw) {
      this.message = "没有找到存档。"; // 无存档时提示。
      return; // 结束。
    }

    const data = JSON.parse(raw); // 把 JSON 字符串解析成对象。
    this.day = data.day; // 恢复日期。
    this.gold = data.gold; // 恢复金币。
    this.selectedCrop = data.selectedCrop; // 恢复当前选择作物。
    this.inventory = data.inventory; // 恢复背包。
    this.map = data.map; // 恢复地图。
    this.message = "读档成功。"; // 提示。
  }

  // 启动时自动尝试读档：有档就恢复，没档就静默跳过。
  tryLoad() {
    const raw = localStorage.getItem(CONFIG.saveKey); // 读取可能存在的存档。
    if (!raw) return; // 没有就直接结束。

    try {
      const data = JSON.parse(raw); // 尝试解析。
      this.day = data.day ?? this.day; // 空值合并避免字段缺失时崩溃。
      this.gold = data.gold ?? this.gold;
      this.selectedCrop = data.selectedCrop ?? this.selectedCrop;
      this.inventory = data.inventory ?? this.inventory;
      this.map = data.map ?? this.map;
      this.message = "已自动加载上次存档。"; // 自动读档反馈。
    } catch {
      this.message = "检测到损坏存档，已忽略。"; // 非法 JSON 时给提示。
    }
  }

  // 根据地块状态返回基础颜色（像素方块风格）。
  getTileColor(tile) {
    if (tile.state === TILE_STATE.GRASS) return "#2e7d32"; // 草地深绿。
    if (tile.state === TILE_STATE.TILLED) return "#6d4c41"; // 耕地棕色。
    if (tile.state === TILE_STATE.SEEDED) return "#8d6e63"; // 已播种浅棕。
    if (tile.state === TILE_STATE.READY && tile.cropType) return CROP_TYPES[tile.cropType].readyColor; // 成熟按作物类型显示颜色。
    return "#000"; // 理论兜底颜色（不会走到）。
  }

  // 绘制地图、作物标记、光标框。
  render() {
    const { ctx } = this; // 解构获取 ctx，减少重复书写。
    const { tileSize } = CONFIG; // 拿到地块像素尺寸。

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 每帧先清空画布。

    for (let y = 0; y < CONFIG.mapRows; y += 1) {
      for (let x = 0; x < CONFIG.mapCols; x += 1) {
        const tile = this.map[y][x]; // 当前遍历地块。
        const px = x * tileSize; // 地块左上角像素 x。
        const py = y * tileSize; // 地块左上角像素 y。

        ctx.fillStyle = this.getTileColor(tile); // 根据状态设置填充色。
        ctx.fillRect(px, py, tileSize, tileSize); // 画地块底色矩形。

        ctx.strokeStyle = "#1a1a1a"; // 网格线颜色。
        ctx.strokeRect(px, py, tileSize, tileSize); // 画格子边框。

        if ((tile.state === TILE_STATE.SEEDED || tile.state === TILE_STATE.READY) && tile.cropType) {
          ctx.fillStyle = CROP_TYPES[tile.cropType].seedColor; // 用作物配置里的颜色区分种类。
          ctx.fillRect(px + tileSize / 2 - 4, py + tileSize / 2 - 4, 8, 8); // 中心画一个标记块。

          if (tile.watered) {
            ctx.strokeStyle = "#42a5f5"; // 浇水高亮边框颜色（蓝色）。
            ctx.lineWidth = 3; // 加粗边框更显眼。
            ctx.strokeRect(px + 2, py + 2, tileSize - 4, tileSize - 4); // 画内框表示“今天浇过水”。
            ctx.lineWidth = 1; // 还原线宽，避免影响其它绘制。
          }
        }
      }
    }

    const cursorPx = this.cursor.x * tileSize; // 光标像素 x。
    const cursorPy = this.cursor.y * tileSize; // 光标像素 y。

    ctx.strokeStyle = "#ffffff"; // 光标颜色用白色，确保醒目。
    ctx.lineWidth = 3; // 光标边框稍粗。
    ctx.strokeRect(cursorPx + 1, cursorPy + 1, tileSize - 2, tileSize - 2); // 在选中格子周围画框。
    ctx.lineWidth = 1; // 还原默认线宽。

    this.renderHud(); // 绘制完成后更新 HUD 文本。
  }

  // 更新 HUD 文本，展示关键状态和学习反馈。
  renderHud() {
    const turnip = CROP_TYPES.turnip; // 萝卜配置快捷引用。
    const corn = CROP_TYPES.corn; // 玉米配置快捷引用。
    const selected = CROP_TYPES[this.selectedCrop]; // 当前选中作物。

    this.hud.innerHTML = `
      <strong>日期：</strong>第 ${this.day} 天<br />
      <strong>金币：</strong>${this.gold}<br />
      <strong>当前作物：</strong>${selected.label}（按 1/2 切换）<br />
      <strong>种子：</strong>${turnip.label} ${this.inventory.seeds.turnip} / ${CONFIG.inventoryMax}，${corn.label} ${this.inventory.seeds.corn} / ${CONFIG.inventoryMax}<br />
      <strong>作物：</strong>${turnip.label} ${this.inventory.crops.turnip} / ${CONFIG.inventoryMax}，${corn.label} ${this.inventory.crops.corn} / ${CONFIG.inventoryMax}<br />
      <strong>光标：</strong>(${this.cursor.x}, ${this.cursor.y})<br />
      <strong>提示：</strong>${this.message}
    `; // 使用模板字符串插入实时数据。
  }
}
