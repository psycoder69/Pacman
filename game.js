const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

const createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const fps = 30;
const oneBlockSize = 20;
const wallColor = "#3420ca";
const wallSpaceWidth = (oneBlockSize / 1.5);
const wallOffset = ((oneBlockSize - wallSpaceWidth) / 2);
const wallInnerColor = "#000000";
const foodColor = "#feb897";

const DIRECTION_BOTTOM = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_UP = 3;
const DIRECTION_RIGHT = 4;

let ghosts = [];
const ghostCount = 4;

const ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 }
];

const randomTargetForGhosts = () => [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize }
];

let score = 0;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const gameLoop = () => {
    update();
    draw();
};

const update = () => {
    pacman.moveProcess();
    pacman.eat();
};

const draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black")
    drawWalls();
    drawFoods();
    drawScore();
    pacman.draw();
    drawGhosts();
};

const gameInterval = setInterval(gameLoop, 1000 / fps);

const drawWalls = () => {
    for (let x = 0; x < map.length; x ++) {
        for (let y = 0; y < map[0].length; y ++) {
            if (map[x][y] === 1) {
                createRect(y * oneBlockSize, x * oneBlockSize, oneBlockSize, oneBlockSize, wallColor);
            }

            if (y > 0 && map[x][y-1] === 1) {
                createRect(y * oneBlockSize, x * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
            }

            if (y < map[0].length - 1 && map[x][y+1] === 1) {
                createRect(y * oneBlockSize + wallOffset, x * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
            }

            if (x > 0 && map[x-1][y] === 1) {
                createRect(y * oneBlockSize + wallOffset, x * oneBlockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
            }

            if (x < map.length - 1 && map[x+1][y] === 1) {
                createRect(y * oneBlockSize + wallOffset, x * oneBlockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
            }
        }
    }
};

const drawFoods = () => {
    for (let x = 0; x < map.length; x ++) {
        for (let y = 0; y < map[0].length; y ++) {
            if (map[x][y] === 2) {
                createRect(
                    y * oneBlockSize + oneBlockSize / 3,
                    x * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                );
            }
        }
    }
};

const drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1) + 10);
};

const drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i ++) {
        ghosts[i].draw();
    }
};

const createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

const createGhosts = () => {
    ghosts = [];

    for (let i = 0; i < ghostCount; i ++) {
        const ghost = new Ghost(
            9 * oneBlockSize + (i & 1) * oneBlockSize,
            10 * oneBlockSize + (i & 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i
        );

        ghosts.push(ghost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    const k = event.keyCode;

    setTimeout(() => {
        if (k === 37 || k === 65) {
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k === 38 || k === 87) {
            pacman.nextDirection = DIRECTION_UP;
        } else if (k === 39 || k === 68) {
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k === 40 || k === 83) {
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});