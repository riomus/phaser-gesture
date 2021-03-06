
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
    'right': [["W","W","W","W"],["W","W","W","W"],["W","W","W","W"],["WS","WS","W","W"],["WS","WS","W","W"],["NW","NW","W","W"],["NW","NW","W","W"]]
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
