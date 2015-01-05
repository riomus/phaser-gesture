
'use strict';
var storage={};
function Play() {}
Play.prototype = {
  init:function(gestureRecognition){
    storage.gestureRecognition=gestureRecognition;
  },
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.sprite = this.game.add.sprite(50, 50, 'yeoman');
    this.sprite.scale.set(0.4,0.4);
    this.sprite.inputEnabled = true;


    var bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
    var targetCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.target = this.game.add.sprite(50, 50, 'yeoman');
    this.game.physics.arcade.enable(this.target);
    this.target.scale.set(0.4,0.4);
    this.target.anchor.setTo(0.5, 0.5);
    this.target.y=this.game.height/2;
    this.target.x=this.game.width-60;

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(0.1);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.y=this.game.height/2;
    storage.gestureRecognition.onMove(function(data){
     requestAnimationFrame(function(){
      if(data.indexOf('N')>-1){
        this.sprite.body.velocity.y-=30;
      }
      if(data.indexOf('S')>-1){
        this.sprite.y+=5;
        this.sprite.body.velocity.y+=30;
      }
      console.log(data);
    }.bind(this));
   }.bind(this));
    storage.gestureRecognition.onDetect(function(){
      requestAnimationFrame(function(){
        console.log('right');
        var bullet=this.bullets.create(this.sprite.x, this.sprite.y, 'yeoman');
        this.game.physics.arcade.enable(bullet);
        bullet.scale.set(0.1,0.1);
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
    this.game.state.start('gameover',true,false,storage.gestureRecognition);
  },
  update: function() {
     this.game.physics.arcade.overlap(this.bullets, this.target, this.gameEnd, null, this);
  }
};

module.exports = Play;
