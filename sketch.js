let isGameOver = false;
let canvas = {
    width: 994,
    height: 406,
    cellWidth: 38,
    cellHeight: 47,
    startX: 120,
    startY: 77
}
let head = {
    x: canvas.startY,
    y: canvas.startX,
    image: 0
}
let snake = {
    headY: canvas.startY,
    headX: canvas.startX,
    directionX: 1,
    directionY: 0,
    image: 0
}
let blackout = {
    x: 0, y: 0, image: 0
}
let tail = []


function preload() {
    snake.image = loadImage('./images/blackout-icon.png')
    blackout.image = loadImage('./images/maybe-icon.png')
}

function setup() {
    createCanvas(canvas.width, canvas.height);
    angleMode(DEGREES);
    frameRate(120);
    generateRandomBlackoutCoordinates();
}

function draw() {
    move()

    if (isGameOver) {
        return 0
    }
    drawGrid();
    if (isTailCollision()) {
        gameOver();
    }
    if (isBlackoutCollision()) {
        appendTail(snake.headX, snake.headY);
        generateRandomBlackoutCoordinates();
    } else {
        shiftTail(snake.headX, snake.headY);
    }
    drawTail();
    drawPixel(snake.headX, snake.headY);
    drawBlackout();
    frameRate(10);
}

function isTailCollision() {
    return tail.filter(e => e.x == snake.headX && e.y == snake.headY).length > 0
}

function gameOver() {
    for (let i = canvas.startY; i <= canvas.height; i += canvas.cellHeight) {
        for (let j = canvas.startX; j <= canvas.width; j += canvas.cellWidth) {
            image(snake.image, j, i, canvas.cellWidth, canvas.cellHeight);
        }
    }
    isGameOver = true
}

function appendTail(x, y) {
    tail.unshift({
        x: x,
        y: y
    });
}

function shiftTail(x, y) {
    tail.pop();
    tail.unshift({
        x: x,
        y: y
    });
}

function drawTail() {
    tail.forEach(e => image(snake.image, e.x, e.y, canvas.cellWidth, canvas.cellHeight))
}

function isBlackoutCollision() {
    return blackout.x == snake.headX && blackout.y == snake.headY;
}

function generateRandomBlackoutCoordinates() {
    let blackoutX = Math.floor(Math.random() * (canvas.width - canvas.startX)) + canvas.startX
    let blackoutY = Math.floor(Math.random() * (canvas.height - canvas.startY)) + canvas.startY

    blackout.x = blackoutX - ((blackoutX - canvas.startX) % canvas.cellWidth)
    blackout.y = blackoutY - ((blackoutY - canvas.startY) % canvas.cellHeight)

    if (tail.filter(e => e.x == blackout.x && e.y == blackout.y).length > 0){
        generateRandomBlackoutCoordinates()
    }
}

function drawBlackout() {
    image(blackout.image, blackout.x, blackout.y, canvas.cellWidth, canvas.cellHeight)
}

function keyPressed() {
    if (keyCode == 65 && snake.directionX != 1) { // a
        snake.directionX = -1;
        snake.directionY = 0;
    } else if (keyCode == 83 && snake.directionY != -1) { //s
        snake.directionY = 1;
        snake.directionX = 0;
    } else if (keyCode == 87 && snake.directionY != 1) { //w
        snake.directionY = -1;
        snake.directionX = 0;
    } else if (keyCode == 68 && snake.directionX != -1) { //d
        snake.directionX = 1;
        snake.directionY = 0;
    }
}
function move() {
    snake.headX += snake.directionX * canvas.cellWidth;
    snake.headY += snake.directionY * canvas.cellHeight;
    if (snake.headX >= canvas.width) {
        snake.headX = canvas.startX
    } else if (snake.headX < canvas.startX) {
        snake.headX = canvas.width - canvas.cellWidth
    }
    if (snake.headY >= canvas.height) {
        snake.headY = canvas.startY
    } else if (snake.headY < canvas.startY) {
        snake.headY = canvas.height - canvas.cellHeight
    }
}

function drawPixel(x, y) {
    image(snake.image, x, y, canvas.cellWidth, canvas.cellHeight)
}

function drawGrid() {
    rect(0, 0, canvas.width, canvas.height)
    stroke(200);
    line(0, 0, 0, canvas.height);
    line(0, 0, canvas.width, 0);
    line(canvas.width, 0, canvas.width, canvas.height);
    line(0, canvas.height, canvas.width, canvas.height);

    for (let i = canvas.startY; i <= canvas.height; i += canvas.cellHeight) {
        line(0, i, canvas.width, i);
    }
    for (let i = canvas.startX; i <= canvas.width; i += canvas.cellWidth) {
        line(i, 0, i, canvas.height);
    }

    days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', `П'ятниця`, 'Субота', 'Неділя']
    textSize(canvas.cellHeight / 3);

    for (let i = 0; i < 7; i++) {
        text(days[i], 20, canvas.cellHeight * i + (canvas.startY + canvas.cellHeight / 2 + canvas.cellHeight / 3 / 2));
    }
    for (let i = 0; i < 24; i++) {
        push();
        translate(canvas.cellWidth * i + canvas.startX + 15, 15);
        rotate(90);
        text(`${n(i)} - ${n((i + 1) % 24)}`, 0, 0);
        pop();
    }
}


function n(n) {
    return n > 9 ? "" + n : "0" + n;
}