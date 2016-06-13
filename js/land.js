﻿var canvas;
var ctx;

var WIDTH = 500;
var HEIGHT = 400;
var CHUNK = 10;
var yPoints = [];
yPoints[0] = 250;
var startIndex = 0;
var endIndex = WIDTH / CHUNK;
var countKeyPressRight = 0;
var countKeyPressLeft = 0;
var arrayLength = 1;

function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    for (i = 1; i < endIndex; i++) {
        arrayLength = yPoints.push(yPoints[i - 1] + getRandomInt(-5, 5));
    }

    return setInterval(draw, 100);
}


function doKeyDown(evt) {
    switch (evt.keyCode) {
        case 37:
            {
                countKeyPressRight--;
                countKeyPressLeft++;
                startIndex--;
                endIndex--;

                console.log(startIndex);
                console.log(endIndex);

                {
                    if (WIDTH / CHUNK + countKeyPressLeft > arrayLength) {
                        yPoints[-1 * countKeyPressLeft] = yPoints[1 - countKeyPressLeft] + getRandomInt(-5, 5);
                    }
                }

            }
            break;
        case 39:
            {
                countKeyPressLeft--;
                countKeyPressRight++;
                startIndex++;
                endIndex++;
                {
                    if (WIDTH / CHUNK + countKeyPressRight > arrayLength) {
                        yPoints.push(yPoints[arrayLength - 1] + getRandomInt(-5, 5));
                    }
                }
            }
            break;
    }
}


function draw() {
    clearCanvas(ctx, canvas);
    ctx.moveTo(0, yPoints[startIndex]);

    console.log(startIndex);
    for (i = startIndex; i < endIndex; i++) {
        ctx.lineTo(CHUNK * (i - startIndex + 1), yPoints[i]);
        ctx.stroke();
    }
}


init();
window.addEventListener('keydown', doKeyDown, true);

