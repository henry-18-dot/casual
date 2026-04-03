// 导出一个配置对象，把游戏里的“魔法数字”集中管理，后续调参更容易。
export const CONFIG = {
  tileSize: 64, // 每个地块像素大小：64x64，视觉上比较清晰。
  mapCols: 10, // 地图列数（横向 10 格）。
  mapRows: 10, // 地图行数（纵向 10 格）。
  waterBonus: 1, // 被浇水后额外增加的生长点数（相当于加速）。
  startGold: 30, // 开局金币，阶段三提高一点，便于尝试多作物。
  inventoryMax: 99, // 教学版背包上限（单种物品）。
  saveKey: "pixel_farm_stage4_save", // LocalStorage 的存档键名（阶段四独立键，避免旧档结构冲突）。
  shopBatchSize: 5, // 商店“批量买卖”默认数量。
};

// 阶段三/四：多作物配置表（商店价格、生长天数、售价、颜色）。
export const CROP_TYPES = {
  turnip: {
    label: "萝卜", // 用于 HUD 和提示语的中文名。
    seedPrice: 2, // 购买 1 粒该种子要花多少钱。
    growDays: 3, // 需要多少生长点成熟。
    sellPrice: 8, // 卖出 1 个作物获得金币。
    seedColor: "#ffeb3b", // 地块中“种子点”的颜色。
    readyColor: "#f9a825", // 成熟时地块颜色。
    startSeeds: 6, // 开局赠送的种子数量。
  },
  corn: {
    label: "玉米", // 第二种作物：生长期长、收益高。
    seedPrice: 4,
    growDays: 5,
    sellPrice: 16,
    seedColor: "#ffe082",
    readyColor: "#ffb300",
    startSeeds: 2,
  },
};

// 用对象字面量枚举地块状态，让代码语义化，避免字符串散落。
export const TILE_STATE = {
  GRASS: "grass", // 草地：初始状态，不能直接播种。
  TILLED: "tilled", // 耕地：可播种但还没有种子。
  SEEDED: "seeded", // 已播种：进入生长过程。
  READY: "ready", // 已成熟：可收获获得作物。
};
