var $Canvas = $('#stage');
var context = $Canvas[0].getContext('2d');

var color;
var cleanMode = false;
var isCircle = false;
var isMouseDown = false;

var canvasOffset = $Canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var startX;
var startY;
var mouseX;
var mouseY;


function setColor() {
    color = $('#colors li.active').css('background-color');
}

setColor();

$('#new-color').on('click', function () {
    $('.new-color-box').toggle();
});

$('#add-color').on('click', function () {
    let Color = $('#live-color').css('background-color');
    $('#colors li').removeClass('active');
    $('#colors').append('<li class="active" style="background-color: ' + Color + '"></li>');
    $('#new-color').trigger('click');
    cleanMode=false;
    setColor();
});

$('#r, #g, #b').on('change', function () {
    let Colors = {
        red: $('#r').val(),
        blue: $('#b').val(),
        green: $('#g').val()
    };
    $('#live-color').css('background-color', 'rgb(' + Colors.red + ',' + Colors.green + ',' + Colors.blue + ')');
});


$('#colors').on('click', 'li', function () {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    setColor();
    cleanMode = false;
    isCircle = false;
});


$('#cl').on('click', function () {
    cleanMode = !cleanMode;
    isCircle = false;
});

$('#clear').on('click', function () {
    context.clearRect(0, 0, $Canvas[0].width, $Canvas[0].height);
});

$('#circle').on('click',function () {
    isCircle = !isCircle;
    cleanMode = false;
});

///////////////////////////////////////////
$Canvas.on('mousedown', function (e) {
    if(isCircle){
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    }
    else {
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
    }
    isMouseDown = true;
}).on('mousemove', function (e2) {
    if (isMouseDown) {
        if(isCircle){
            e2.preventDefault();
            e2.stopPropagation();
            mouseX = e2.clientX - offsetX;
            mouseY = e2.clientY - offsetY;
            drawOval(mouseX, mouseY);
        }
        else{
            context.lineTo(e2.offsetX, e2.offsetY);
            if (cleanMode) {
                context.globalCompositeOperation = 'destination-out';
                context.lineWidth = 15;
                $Canvas.css('cursor','url("./eraser.png"),auto');
            } else {
                context.globalCompositeOperation = 'source-over';
                context.strokeStyle = color;
                context.lineWidth = 1;
                $Canvas.css('cursor','url("./cursor.png"),auto');

            }

        }
        context.stroke();
    }
}).on('mouseup', function () {
    isMouseDown = false;
}).on('mouseout', function () {
    isMouseDown = false;
});
///////////////////////////////////////

function drawOval(x, y) {
    context.clearRect(0, 0, $Canvas[0].width, $Canvas[0].height);
    context.beginPath();
    context.moveTo(startX, startY + (y - startY) / 2);
    context.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
    context.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
    context.closePath();
}

