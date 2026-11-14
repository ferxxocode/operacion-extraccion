# Modelos 3D utilizados

Los tres modelos se cargan directamente desde sus URL CDN (no hace falta descargar archivos manualmente para ejecutar el juego). Todos están publicados bajo **Creative Commons CC0 1.0**, según las fichas de sus autores en 3DAssets.dev.

| Uso en el juego | Modelo | GLB CDN | Polígonos / animaciones |
|---|---|---|---|
| Pistola | Compact Pistol, Carry Loadout (Mega Weapon Pack) | https://cdn.3dassets.dev/assets/33458/v1/model.glb | 37.9k triángulos; slide-open/close, magazine-open/close y cock |
| Rifle | Standard Assault Rifle (Mega Weapon Pack) | https://cdn.3dassets.dev/assets/33318/v1/model.glb | 37.9k triángulos; magazine-open/close y charge-open/close |
| Zombi | Infected Runner, Jointed (FPS Survival Forest Outpost) | https://cdn.3dassets.dev/assets/32707/v1/model.glb | 12.6k triángulos; idle, head-turn y arm-swing |

## Fichas originales y licencias

- Pistola: https://3dassets.dev/assets/mega-weapon-pack-compact-pistol-carry-loadout-cc8dacf4
- Rifle: https://3dassets.dev/assets/mega-weapon-pack-standard-rifle-94762172
- Zombi: https://3dassets.dev/assets/fps-survival-forest-outpost-creature-infected-runner-d6e26047
- Licencia CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/

**Nota de animación del zombi:** el modelo tiene animaciones de reposo, giro de cabeza y balanceo de brazos; no incluye un ciclo de piernas caminando. El movimiento de persecución se calcula en `js/zombies.js`, con desplazamiento y balanceo corporal.

**Nota de procedencia:** las fichas de estos modelos indican que fueron creados con asistencia de herramientas de IA. Se integran como recursos externos, no como modelos originales creados por el estudiante.
