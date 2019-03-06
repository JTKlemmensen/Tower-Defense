$(function () 
{
    createSprite();
});
///////////////////////////////////////////////////////////
////////////////////// Entities ///////////////////////////
///////////////////////////////////////////////////////////
var entities = {};

///////////////////////////////////////////////////////////
//////////////////// Constructors /////////////////////////
///////////////////////////////////////////////////////////
function createTower()
{
    
}

function createEntity(x, y, sprite)
{
    
}

function createSprite()
{
    var img = {};
    var newImg = new Image;
    newImg.onload = function () {
            var canvas = $("canvas")[0];
    var context = canvas.getContext("2d");
    context.drawImage(newImg,0,0);
    }
    newImg.src = '/images/test';
    
    img.Image = newImg;
    return img;
}