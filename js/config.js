export const CONFIG = {
  player: { speed: 7, eyeHeight: 1.7, radius: 0.42 },
  weapons: {
    pistol: {
      name: "PISTOLA",
      damage: 1,
      magazine: 12,
      reserve: 12,
      fireDelay: 280,
      // Modelo 3D CC0 alojado en 3DAssets.dev (Compact Pistol, Carry Loadout).
      model: "https://cdn.3dassets.dev/assets/33458/v1/model.glb"
    },
    rifle: {
      name: "FUSIL DE ASALTO",
      damage: 1,
      magazine: 30,
      reserve: 30,
      fireDelay: 110,
      // Modelo 3D CC0 alojado en 3DAssets.dev (Standard Assault Rifle).
      model: "https://cdn.3dassets.dev/assets/33318/v1/model.glb"
    }
  },
  zombie: {
    health: 2,
    speed: 1.9,
    detectRange: 28,
    attackRange: 1.25,
    radius: 0.48,
    // Modelo 3D CC0 alojado en 3DAssets.dev (Infected Runner, Jointed).
    model: "https://cdn.3dassets.dev/assets/32707/v1/model.glb"
  },
  world: { size: 90, extraction: { x: 0, z: -37, radius: 4 } }
};
