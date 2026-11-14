# Operación Extracción

**Videojuego FPS 3D de supervivencia zombi** desarrollado como proyecto académico T3 para el curso de Computación Gráfica y Visual (UPN).

El jugador debe sobrevivir en un escenario abandonado, eliminar zombis, recoger munición y alcanzar la zona verde de extracción.

## Tecnologías

- **HTML5**: estructura de la interfaz.
- **CSS3**: presentación del menú y HUD.
- **JavaScript (ES Modules)**: lógica y organización del videojuego.
- **Three.js 0.160.0**: escena, cámara, geometrías, materiales, luces y renderizado 3D mediante WebGL.
- **GLTFLoader**: carga de modelos 3D en formato GLB.
- **WebGL**: renderizado acelerado por hardware en el navegador.

## Cómo ejecutar el proyecto

### Requisitos

- Navegador actualizado con soporte para WebGL.
- Conexión a Internet: Three.js y los modelos GLB principales se cargan desde CDN.
- Un servidor HTTP local. No abras el archivo index.html directamente como archivo (file://).

### Opción A: Visual Studio Code + Live Server

1. Clona o descarga este repositorio.
2. Abre la carpeta operacion-extraccion en Visual Studio Code.
3. Instala la extensión **Live Server**, si todavía no la tienes.
4. Haz clic derecho en index.html y selecciona **Open with Live Server**.
5. El juego se abrirá en el navegador.

### Opción B: Node.js

Desde la carpeta del proyecto, ejecuta:

~~~bash
npx serve .
~~~

Abre en el navegador la dirección local que indique la terminal.

## Controles

| Acción | Control |
|---|---|
| Moverse | W, A, S, D |
| Mirar | Movimiento del mouse |
| Disparar | Clic izquierdo |
| Cambiar a pistola | Tecla 1 |
| Cambiar a fusil | Tecla 2 |
| Liberar el cursor | ESC |

**Disparo:** la pistola dispara una vez por clic. El fusil dispara de forma automática mientras mantienes presionado el clic izquierdo, respetando su intervalo entre disparos.

No hay recarga manual mediante una tecla: las cajas de abastecimiento recuperan munición automáticamente cuando el jugador se acerca.

## Objetivo y mecánicas

- Explorar un escenario 3D de ambiente postapocalíptico.
- Utilizar dos armas con parámetros y munición independientes.
- Detectar impactos mediante **Raycasting** desde el centro de la cámara.
- Enfrentarse a zombis que se activan cuando el jugador entra en su radio de detección y luego lo persiguen.
- Eliminar cada zombi con dos impactos válidos.
- Evitar el contacto con los enemigos, que reduce la vida del jugador.
- Recoger cajas de munición distribuidas por el escenario.
- Llegar a la zona verde para completar la extracción.
- Perder la partida si la vida del jugador llega a cero.

## Estructura del proyecto

~~~text
operacion-extraccion/
├── index.html          # Estructura del menú, HUD y pantallas finales
├── style.css           # Estilos de la interfaz
├── README.md           # Documentación del proyecto
├── ASSETS.md           # Fuentes, modelos 3D y licencias
├── js/
│   ├── main.js         # Punto de entrada y botones
│   ├── game.js         # Coordinación y ciclo principal del juego
│   ├── config.js       # Parámetros del jugador, armas, zombis y mundo
│   ├── player.js       # Cámara FPS, controles, movimiento y vida
│   ├── world.js        # Escenario, iluminación, obstáculos y extracción
│   ├── weapons.js      # Modelos, selección, disparos y munición
│   ├── zombies.js      # Enemigos, detección, persecución y daño
│   ├── ammo.js         # Cajas coleccionables de munición
│   └── ui.js           # HUD, notificaciones y pantallas finales
└── assets/
    ├── weapons/        # Modelos GLB de respaldo incluidos en el repositorio
    └── zombies/        # Modelo GLB de respaldo incluido en el repositorio
~~~

## Modelos 3D y licencias

Los modelos detallados que utiliza actualmente el juego se cargan desde el CDN de **3DAssets.dev** mediante GLTFLoader. Sus fichas indican licencia **CC0 1.0**. Se necesita conexión a Internet para descargarlos.

- Pistola: [Compact Pistol – Carry Loadout](https://3dassets.dev/assets/mega-weapon-pack-compact-pistol-carry-loadout-cc8dacf4).
- Fusil: [Standard Assault Rifle](https://3dassets.dev/assets/mega-weapon-pack-standard-rifle-94762172).
- Zombi: [Infected Runner – Jointed](https://3dassets.dev/assets/fps-survival-forest-outpost-creature-infected-runner-d6e26047).

Las URL CDN y los detalles de procedencia se documentan en [ASSETS.md](ASSETS.md). Los archivos de assets/ son modelos de respaldo heredados y **no son las fuentes activas de los modelos detallados**. Si un modelo remoto no carga, el código genera una representación geométrica sencilla de respaldo.

**Nota sobre el zombi:** el modelo externo incluye animaciones de reposo, giro de cabeza y balanceo de brazos; no incluye un ciclo completo de caminata con movimiento de piernas. El desplazamiento de persecución se implementa en JavaScript.

## Organización del código

El proyecto utiliza módulos ES para separar responsabilidades. main.js inicia la aplicación y game.js coordina los sistemas. Los demás módulos gestionan el jugador, el escenario, las armas, los enemigos, la munición y la interfaz. Los parámetros ajustables se centralizan en js/config.js.

## Autoría académica

Proyecto académico desarrollado por **Fernando Valdivia** para el curso de Computación Gráfica y Visual (UPN).

Los modelos 3D externos se atribuyen a sus respectivas fichas de 3DAssets.dev; no se presentan como modelos originales creados por el estudiante.

## Créditos

- [Three.js](https://threejs.org/) – biblioteca de gráficos 3D.
- [3DAssets.dev](https://3dassets.dev/) – modelos GLB externos.
- [Creative Commons CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) – licencia indicada en las fichas de los modelos.
