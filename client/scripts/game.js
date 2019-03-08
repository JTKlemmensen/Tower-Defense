///////////////////////////////////////////////////////////
/////////////////////// SETUP /////////////////////////////
///////////////////////////////////////////////////////////
var towerDefense = {};

$(function () 
{
    loadImages();
    console.log(';:D');
    var fps = 60;
    var updateRate = 1000/fps;
    window.setInterval(towerDefense.events.onDraw, updateRate);

    var canvas = $("canvas").mousedown(canvasMouseDown)
                            .mouseup(canvasMouseUp)
                            .mousemove(canvasMouseMove)
                            .mouseleave(canvasMouseLeave);
    
    createSprite();
    var ent = createEntity(0,0,'test3');
    createEntity(50,50,'test2');
});

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    $("#fps").text(fps);
    //refreshLoop();
  });
}
var imgs = [];

function loadImages()
{
    loadImage('test');
    loadImage('test1');
    loadImage('test2');
    loadImage('test3');
}

function loadImage(name)
{
    var newImg = new Image;
    newImg.onload = function () {
        console.log("Done");
    }
    newImg.src = '/images/'+name;
    imgs[name] = newImg;
}
///////////////////////////////////////////////////////////
////////////////////// Entities ///////////////////////////
///////////////////////////////////////////////////////////
var entities = [];

function StoneTower()
{
    var ent = createEntity(0,0,'test');
}

///////////////////////////////////////////////////////////
//////////////////// Constructors /////////////////////////
///////////////////////////////////////////////////////////
function createTower()
{
    
}

function createEntity(x, y, sprite)
{
    var ent = {};
    ent.x = x;
    ent.y = y;
    ent.sprite = imgs[sprite];
    
    entities.push(ent);
}

var x = 0;
var y= 0;
function createSprite()
{
    refreshLoop();
    var img = {};
    var newImg = new Image;
    newImg.onload = function () {
            var canvas = $("canvas")[0];
    var context = canvas.getContext("2d");
    context.fillStyle = "#FF0000";
    context.fillRect(0,0,300,300);
    
    for(var i=0;i<entities.length;i++)
    {
        var ent = entities[i];
    //context.drawImage(ent.sprite,ent.x,ent.y);
    }
    drawRotatedImg(imgs['test1'],50,50,x++,context);
    }
    newImg.src = '/images/test';
    
    img.Image = newImg;
    return img;
}

function drawRotatedImg(img, x, y, angle, context)
{
   context.save();
   context.translate(x+img.width/2,y+img.height/2);
   context.rotate(angle*Math.PI/180);
   context.translate(-x-img.width/2,-y-img.height/2);
   context.drawImage(img,x,y);
   context.restore();
}

///////////////////////////////////////////////////////////
//////////////////// CanvasEvents /////////////////////////
///////////////////////////////////////////////////////////

function canvasMouseDown()
{
    console.log("asdDown");
    towerDefense.mouseDrag = true;
}

function canvasMouseUp()
{
    towerDefense.mouseDrag = false;
}

function canvasMouseMove(evt)
{
    var canvas = $("canvas")[0];
    var rect = canvas.getBoundingClientRect();

    x= evt.clientX - rect.left;
    y=evt.clientY - rect.top;
    if(towerDefense.mouseDrag == true)
        if(towerDefense.events.onDrag() == false)
            towerDefense.mouseDrag = false;
}

function canvasMouseLeave()
{
    towerDefense.mouseDrag = false;
}

///////////////////////////////////////////////////////////
//////////////// Tower Defense Events /////////////////////
///////////////////////////////////////////////////////////
towerDefense.events = {};

towerDefense.events.onDrag = function()
{
    // Game logic when mouse is dragging, return false to stop it
    console.log("ENTITIES ARE BEING DRAGGED");
    
    return true;
}

towerDefense.events.onDraw = function()
{
    // Draw code
    var canvas = $("canvas")[0];
    var context = canvas.getContext("2d");
    context.fillStyle = "#FF0000";
    context.fillRect(0,0,canvas.width,canvas.height);
 
    for(var grassX =0;grassX<canvas.width/64;grassX++)
    {
        for(var grassY =0;grassY<canvas.height/64;grassY++)
        context.drawImage(imgs['test3'],grassX*64,grassY*64);    
    }
    /*   
    for(var p=0;p<1000;p++)
    for(var i=0;i<entities.length;i++)
    {
        var ent = entities[i];
    context.drawImage(ent.sprite,ent.x,ent.y);
    }
*/
    drawRotatedImg(imgs['test1'],50,50,x++,context);
    refreshLoop();
}