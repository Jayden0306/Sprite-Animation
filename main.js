var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, row) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    this.row = row;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight + (this.row - 1) * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}



Animation.prototype.drawSpecificFrame = function (ctx, x, y , row, col) {

  ctx.drawImage(this.spriteSheet,
               col * this.frameWidth,
               row * this.frameHeight,  // source from sheet
               this.frameWidth, this.frameHeight,
               x, y,
               this.frameWidth * this.scale,
               this.frameHeight * this.scale);
}

function Sara(game, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1 );
    this.speed = 100;
    this.ctx = game.ctx;
    this.x = 300;
    this.y = 730;
    this.game = game;
    this.row = 12;
    this.width = 64;
    this.height = 64;
    this.step = game.STEP;
    this.camera = game.camera;
    this.game.camera.follow();

}

Sara.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, 
        this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
        this.row);
}

Sara.prototype.update = function() {

    if(this.game.chars[68] || this.game.chars[39]) {
        this.moveRight();
    }else if(this.game.chars[65] || this.game.chars[37]) {
        this.moveLeft();
    }else if(this.game.chars[87] || this.game.chars[38]) {
        this.moveUp();
    }else if(this.game.chars[83] || this.game.chars[40]) {
        this.moveDown();
    }else if(this.game.chars[32]) {

    }

    //dont let the player leaves the world's boundary
    //check left boundary
    if(this.x - this.width/2 < 0) {
        // console.log("before boundary x : " + this.x);
        this.x = this.width/2;
        // console.log("boundary x : " + this.x);
    }
    //check top boundary
    if(this.y - this.height/2 < 0) {
        this.y = this.height/2;
        // console.log("top boundary y : " + this.y);
    }

    //check right boundary
    if(this.x + this.width/2 > this.game.worldWidth) {
        this.x = this.game.worldWidth - this.width/2;
        // console.log("char boundary x : " + this.x);
    }

    //check bottom boundary
    // console.log("y: " + (this.y + this.height/2) + " worldHeight" + this.game.worldHeight);
    if(this.y + this.height/2 > this.game.worldHeight) {
        this.y = this.game.worldHeight - this.height/2;
        // console.log("boundary y : " + this.y);
    }

}

Sara.prototype.moveUp = function() {
    this.row = 9;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this. y, this.row);
    this.y -= this.step * this.speed;
}

Sara.prototype.moveDown = function() {
    this.row = 11;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this. y, this.row);
    this.y += this.step * this.speed;
    // console.log("Y = " + this.y);
}

Sara.prototype.moveLeft = function() {
    this.row = 10;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this. y, this.row);
    this.x -= this.step * this.speed;
    // console.log("Y = " + this.y);
}

Sara.prototype.moveRight = function() {
    this.row = 12;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this. y, this.row);
    this.x += this.step * this.speed;
    // this.x += 2;
    // console.log("Y = " + this.y);
}

Sara.prototype.jump = function() {

}

Sara.prototype.attack = function() {

}


AM.queueDownload("./img/town_background.jpg");
AM.queueDownload("./img/sara.png");
AM.queueDownload("./img/Tron.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx, AM.getAsset("./img/town_background.jpg"));
    gameEngine.start();

    gameEngine.addEntity(new Sara(gameEngine, AM.getAsset("./img/sara.png")));
    gameEngine.follow();

    console.log("All Done!");
});