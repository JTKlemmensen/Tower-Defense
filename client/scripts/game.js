///////////////////////////////////////////////////////////
/////////////////////// SETUP /////////////////////////////
///////////////////////////////////////////////////////////
var towerDefense = {};
$(function () 
{
    towerDefense.setupCanvas();
    loadImages();
    loadTiles();
    towerDefense.generateMap();
    var fps = 60;
    var updateRate = 1000/fps;
    window.setInterval(towerDefense.events.onDraw, updateRate);

    var canvas = $("canvas").mousedown(canvasMouseDown)
                            .mouseup(canvasMouseUp)
                            .mousemove(canvasMouseMove)
                            .mouseleave(canvasMouseLeave);
    for(var i=0;i<30;i++)
        for(var y=0;y<30;y++)
    towerDefense.createStoneTower(64*i,64*y);
});

const times = [];
let fps;

function updateFps() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    $("#fps").text(fps);
  });
}
var imgs = [];

towerDefense.setupCanvas = function()
{
    var canvas = $('canvas')[0];
    canvas.width = 64*14;
    canvas.height = 64*14;
    towerDefense.canvasWidth = canvas.width;
    towerDefense.canvasHeight = canvas.height;
}

///////////////////////////////////////////////////////////
/////////////////////// Images ////////////////////////////
///////////////////////////////////////////////////////////

function loadImages()
{
    var imgNames = ['test','test1','test2','test3','test4'];
    imgNames.forEach(function(el){
        loadImage(el);
    });
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
/////////////////////// Camera ////////////////////////////
///////////////////////////////////////////////////////////
towerDefense.cameraX = 0;
towerDefense.cameraY = 0;

towerDefense.setCameraPos = function(x,y)
{
    if(x>=0)
    {
        var maxX = towerDefense.mapWidth-towerDefense.canvasWidth;
        var maxX = maxX + Math.floor(maxX/64);
        if(x<maxX)
            towerDefense.cameraX = x;
        else
            towerDefense.cameraX = maxX-1; // index starts at 0
    }
    else
        towerDefense.cameraX = 0;
    
    if(y>=0)
    {
        var maxY = towerDefense.mapHeight-towerDefense.canvasHeight;
        var maxY = maxY + Math.floor(maxY/64);
        if(y<maxY)
            towerDefense.cameraY = y;
        else
            towerDefense.cameraY = maxY-1; // index starts at 0
    }
    else
        towerDefense.cameraY = 0;
}

///////////////////////////////////////////////////////////
/////////////////////// Tiles /////////////////////////////
///////////////////////////////////////////////////////////

towerDefense.tiles = [];

function loadTiles()
{
    var tileNames = ['test3','test4'];
    tileNames.forEach(function(el){
        loadTile(el);
    });
}

function loadTile(name)
{
    var tile = {};
    tile.sprite = imgs[name];
    towerDefense.tiles[name] = tile;
}

///////////////////////////////////////////////////////////
//////////////////////// Map //////////////////////////////
///////////////////////////////////////////////////////////

towerDefense.map = [];
towerDefense.mapWidth = 0;
towerDefense.mapHeight = 0;

towerDefense.generateMap = function()
{
    var size= 30;
    for(var x=0;x<size;x++)
    {
        var tileColumn = [];
        for(var y=0;y<size;y++)
        {
            if(y==0 || x==0 || y==size-1 || x==size-1)
                tileColumn.push(towerDefense.tiles['test4']);  
            else
                tileColumn.push(towerDefense.tiles['test3']);  
        }
        towerDefense.map.push(tileColumn);
    }
    
    towerDefense.mapWidth = size*64;
    towerDefense.mapHeight = size*64;
}

towerDefense.getTileAt = function(x, y)
{
    return towerDefense.map[x][y];
}

///////////////////////////////////////////////////////////
////////////////////// Entities ///////////////////////////
///////////////////////////////////////////////////////////
var entities = [];


towerDefense.createStoneTower = function(x,y)
{
    var ent = towerDefense.createEntity(x,y,towerDefense.createSprite('test1'));
    entities.push(ent);
}

towerDefense.createEntity = function(x,y,sprite)
{
    var ent = {};
    ent.x = x;
    ent.y = y;
    ent.sprite = sprite;
    
    return ent;
}

towerDefense.createSprite = function(name)
{
    var sprite = {};
    
    sprite.image = imgs[name]
    return sprite;
}

///////////////////////////////////////////////////////////
//////////////////// CanvasEvents /////////////////////////
///////////////////////////////////////////////////////////
towerDefense.oldX = 0;
towerDefense.oldY = 0;

function canvasMouseDown(evt)
{
    var canvas = $("canvas")[0];
    var rect = canvas.getBoundingClientRect();

    towerDefense.oldX = evt.clientX - rect.left;
    towerDefense.oldY = evt.clientY - rect.top;
    
    console.log("asdDown");
    towerDefense.mouseDrag = true;
    console.log(towerDefense.mouseDrag);
}

function canvasMouseUp()
{
    towerDefense.mouseDrag = false;
}

function canvasMouseMove(evt)
{
    var canvas = $("canvas")[0];
    var rect = canvas.getBoundingClientRect();
    
    var newX = evt.clientX - rect.left;
    var newY =evt.clientY - rect.top;
    if(towerDefense.mouseDrag == true)
        if(towerDefense.events.onDrag(towerDefense.oldX, towerDefense.oldY, newX, newY) == false)
            towerDefense.mouseDrag = true;

    towerDefense.oldX = newX
    towerDefense.oldY = newY;
}

function canvasMouseLeave()
{
    towerDefense.mouseDrag = false;
}

///////////////////////////////////////////////////////////
//////////////// Tower Defense Events /////////////////////
///////////////////////////////////////////////////////////
towerDefense.events = {};

towerDefense.events.onDrag = function(oldX, oldY, newX, newY)
{
    // Game logic when mouse is dragging, return false to stop it
    console.log("ENTITIES ARE BEING DRAGGED");
    towerDefense.setCameraPos(towerDefense.cameraX+(oldX-newX),towerDefense.cameraY+(oldY-newY));
    console.log();
    return true;
}

var angle=0;
towerDefense.events.onDraw = function()
{
    // Draw code
    var canvas = $("canvas")[0];
    var context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width,canvas.height);
    
    drawBackground(canvas,context);
    var x=90;
    //drawRotatedImg(imgs['test1'],64,64,x++,context);
    var drawEnts = 0;
    entities.forEach(function(el){
        if(el.x+el.sprite.image.width>towerDefense.cameraX && el.x<towerDefense.cameraX+towerDefense.canvasWidth &&
           el.y+el.sprite.image.height>towerDefense.cameraY && el.y<towerDefense.cameraY+towerDefense.canvasHeight)
        {
            drawEnts++;
            drawRotatedImg(el.sprite.image,el.x-towerDefense.cameraX+Math.floor(towerDefense.cameraX/64),el.y-towerDefense.cameraY+Math.floor(towerDefense.cameraY/64),angle,context);
        }
    });
    angle++;
    console.log("entity count: "+entities.length);
    console.log("Drew "+drawEnts+" entities")
    updateFps();
}

///////////////////////////////////////////////////////////
/////////////////// Draw Functions ////////////////////////
///////////////////////////////////////////////////////////

function drawRotatedImg(img, x, y, angle, context)
{
   context.save();
   context.translate(x+img.width/2,y+img.height/2);
   context.rotate(angle*Math.PI/180);
   context.translate(-x-img.width/2,-y-img.height/2);
   context.drawImage(img,x,y);
   context.restore();
}

function drawBackground(canvas, context)
{
    var offsetX = towerDefense.cameraX%64;
    var offsetY = towerDefense.cameraY%64;
    var asdX = 0;
    var asdY = 0;
    if(towerDefense.cameraX > 0)
        asdX = Math.floor(towerDefense.cameraX/64);
    if(towerDefense.cameraY > 0)
        asdY = Math.floor(towerDefense.cameraY/64);
    
    for(var x=0;x<canvas.width/64+2;x++)
        for(var y=0;y<canvas.height/64+2;y++)
        {
            var tileIndexX = asdX+x-1;
            var tileIndexY = asdY+y-1;
            
            if(tileIndexX >=0 && tileIndexY >= 0 &&tileIndexX<towerDefense.mapWidth/64 && tileIndexY<towerDefense.mapHeight/64)
                context.drawImage(towerDefense.getTileAt(tileIndexX,tileIndexY).sprite,asdX+(x-1)*64-offsetX,asdY+(y-1)*64-offsetY);
        }   
    /*for(var grassX =0;grassX<canvas.width/64;grassX++)
        for(var grassY =0;grassY<canvas.height/64;grassY++)
            context.drawImage(towerDefense.getTileAt(Math.round(towerDefense.cameraX/64)+grassX,1).sprite,grassX*64+offsetX,grassY*64+offsetY); */  
}