import { Game } from "./game.js";

const game = new Game();
document
  .querySelector("#startButton")
  .addEventListener("click", () => game.start());
document
  .querySelector("#restartButton")
  .addEventListener("click", () => location.reload());
