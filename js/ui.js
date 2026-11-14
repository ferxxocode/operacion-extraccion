export class UI {
  constructor() {
    this.kills = document.querySelector("#kills");
    this.weaponName = document.querySelector("#weaponName");
    this.ammo = document.querySelector("#ammo");
    this.noticeEl = document.querySelector("#notice");
    this.hud = document.querySelector("#hud");
    this.menu = document.querySelector("#menu");
    this.endScreen = document.querySelector("#endScreen");
    this.endTitle = document.querySelector("#endTitle");
    this.endMessage = document.querySelector("#endMessage");
    this.noticeTimer = null;
  }

  showHUD() {
    this.hud.style.display = "block";
    this.menu.classList.add("hidden");
  }

  update({ kills, weapon, ammo, reserve }) {
    this.kills.textContent = kills;
    this.weaponName.textContent = weapon;
    this.ammo.textContent = `${ammo} / ${reserve}`;
  }

  notify(message) {
    this.noticeEl.textContent = message;
    this.noticeEl.style.opacity = "1";
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => {
      this.noticeEl.style.opacity = "0";
    }, 1800);
  }

  end(won) {
    this.hud.style.display = "none";
    this.endScreen.classList.remove("hidden");
    this.endTitle.textContent = won ? "¡MISIÓN COMPLETADA!" : "GAME OVER";
    this.endTitle.style.color = won ? "#a5d5a5" : "#e36f62";
    this.endMessage.textContent = won
      ? "Has llegado a la zona de extracción."
      : "Un zombi te ha atrapado. La misión ha terminado.";
  }
}
