# Operación Extracción – Videojuego FPS 3D

Proyecto académico T3 de Computación Gráfica y Visual (UPN), desarrollado con HTML, CSS, JavaScript y Three.js.

## Requisitos

- Navegador actualizado con soporte WebGL.
- Node.js (recomendado) para ejecutar un servidor local.

## Cómo ejecutar

1. Descarga o clona el repositorio.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta `npx serve .` (o `python -m http.server 8000`).
4. Abre la dirección local que indique el servidor. No abras `index.html` directamente porque los módulos ES y los modelos GLB requieren un servidor HTTP.

## Controles

- W, A, S, D: desplazamiento.
- Movimiento del mouse: orientar la cámara.
- Clic izquierdo: disparar una vez.
- Tecla 1: pistola.
- Tecla 2: fusil.
- ESC: liberar el cursor.

## Estructura

- `index.html`: interfaz, menú, HUD y carga del módulo principal.
- `style.css`: estilos del menú y la interfaz del juego.
- `js/main.js`: punto de entrada y eventos de botones.
- `js/game.js`: coordina el ciclo principal, disparos, impactos y estados de victoria/derrota.
- `js/config.js`: parámetros configurables del jugador, armas, zombis y extracción.
- `js/world.js`: iluminación, suelo, edificios, obstáculos y zona de extracción.
- `js/player.js`: cámara FPS, controles WASD, rotación con mouse y vida.
- `js/weapons.js`: selección de armas, carga GLB, disparo y munición.
- `js/zombies.js`: enemigos, detección, persecución, resistencia y eliminación.
- `js/ammo.js`: cajas coleccionables y recuperación de munición.
- `js/ui.js`: actualización del HUD, avisos y pantallas finales.

## Modelos 3D GLB

Coloca los modelos en:

- `assets/weapons/pistol.glb`
- `assets/weapons/rifle.glb`
- `assets/zombies/zombie.glb`

Si no se encuentra un modelo GLB, el juego muestra una representación geométrica de respaldo para que puedas probar las mecánicas. Para cumplir la rúbrica de modelos GLB, conserva los archivos GLB en esas rutas y verifica que carguen en el navegador.

## Mecánicas implementadas

- Cámara en primera persona con movimiento WASD y orientación por mouse.
- Dos armas seleccionables y contadores de cargador separados.
- Un disparo por clic, con intervalo mínimo entre disparos.
- Raycasting desde el centro de la cámara para detectar impactos.
- Cada zombi requiere dos impactos válidos.
- Los zombis se activan al entrar el jugador en su radio de detección.
- Contacto con un enemigo: reduce la vida del jugador; al llegar a cero aparece Game Over.
- Cajas de munición coleccionables.
- Zona de extracción que activa la victoria.

## Fuentes

- Three.js: https://threejs.org/
- Modelos GLB: indicar aquí la fuente y licencia de los modelos externos que se incorporen.

## Nota técnica

El código está organizado en módulos ES para separar responsabilidades. Los modelos de respaldo son geometría creada por código y no sustituyen los GLB requeridos por la evaluación.


## Modelos 3D externos integrados

El proyecto carga los modelos GLB desde el CDN de 3DAssets.dev mediante `GLTFLoader`. Se necesita conexión a Internet para que aparezcan los modelos y para cargar Three.js desde jsDelivr. Los modelos están publicados bajo licencia CC0 1.0. Los detalles y enlaces de origen están en `ASSETS.md`.

Si deseas alojarlos localmente, descarga cada GLB desde el enlace de origen de `ASSETS.md`, guárdalo en la ruta indicada y cambia en `js/config.js` la URL CDN por `./assets/...`.
