(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phasergesture');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}
var storage={};
GameOver.prototype = {
  init:function(gestureRecognition){
    storage.gestureRecognition=gestureRecognition;
  },
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play',true,false,storage.gestureRecognition);
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}
var gestureRecognition=new GestureRecognition({
  'getVideoElement':function(){
    var element=document.createElement('video');
    element.style.position='absolute';
    element.style.left='10px';
    element.style.top='10px';
    element.style.width='200px';
    element.style.opacity='0.2';
    element.style.height='150px';
    element.autoplay=true;
    element.preload=true;
    element.muted=true;
    element.looped=true;
    document.body.appendChild(element);
    return element;
  },
    'opticalFlow':{
      'width':200,
      'height':150
    },
  'gestures':{
    'right': [["W","W"],["W","W"],["W","W"],["WS","W"],["WS","W"],["NW","W"],["NW","W"]]
  }
});
gestureRecognition.startTracking();
console.log(gestureRecognition);
Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'gesture');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Use, Gestures!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click hand to play!', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play',true,false,gestureRecognition);
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

'use strict';
var storage={};
function Play() {}
Play.prototype = {
  init:function(gestureRecognition){
    storage.gestureRecognition=gestureRecognition;
  },
  create: function() {
    var style = { font: '20px Arial', fill: '#ffffff', align: 'center'};
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.sprite = this.game.add.sprite(50, 50, 'cannon');
    this.sprite.scale.set(1,1);
    this.sprite.inputEnabled = true;
    this.score=0;
    this.scoreText = this.game.add.text(this.game.world.centerX, 15, 'SCORE: 0', style);
    this.scoreText.anchor.setTo(0.5, 0.5);
    var bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
    var targetCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.target = this.game.add.sprite(50, 50, 'buka');
    this.game.physics.arcade.enable(this.target);
    this.target.scale.set(0.6,0.6);
    this.target.anchor.setTo(0.5, 0.5);
    this.target.y=this.game.height/2;
    this.target.x=this.game.width-60;
    this.target.body.collideWorldBounds=true;
    this.target.body.bounce.setTo(1,1);
    this.target.anchor.setTo(0.5, 0.5);
    this.target.body.velocity.y=100;
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(0.1);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.y=this.game.height/2;
    storage.gestureRecognition.onMove(function(data){
      console.log(data);
      requestAnimationFrame(function(){
        if(data.indexOf('N')>-1){
          this.sprite.body.velocity.y-=15;
        }
        if(data.indexOf('S')>-1){
          this.sprite.body.velocity.y+=15;
        }
      }.bind(this));
    }.bind(this));
    storage.gestureRecognition.onDetect(function(data){
      console.log(data);
      requestAnimationFrame(function(){
        var bullet=this.bullets.create(this.sprite.x, this.sprite.y, 'bullet');
        this.game.physics.arcade.enable(bullet);
        bullet.scale.set(0.7,0.7);
        bullet.body.collideWorldBounds=false;
        bullet.body.y=this.sprite.y;
        bullet.x=this.sprite.x;
        bullet.outOfBoundsKill=true;
        bullet.body.gravity.y=100
        bullet.body.velocity.x=Math.random()*600+200;
      }.bind(this));
    }.bind(this),'right');
  },
  gameEnd: function() {
    this.target.alpha=0.2;
    this.score=this.score+1;
  },
  update: function() {
    this.target.alpha=1;
    this.game.physics.arcade.overlap(this.bullets, this.target, this.gameEnd, null, this);
    this.scoreText.setText('SCORE: '+this.score);
    if(this.score>100){
      this.game.state.start('gameover',true,false,storage.gestureRecognition);
    }
  }
};

module.exports = Play;

},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('bullet', 'assets/bullet.gif');
    this.load.image('cannon', 'assets/cannon.png');
    this.load.image('gesture', 'assets/gesture.png');
    this.load.image('buka', 'assets/buka.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])