var instruct = function(game){    };

instruct.prototype = {
    preload: function(){ 
        clickFx = game.add.audio('click');
    },
    
    create: function(){
        bg = this.add.button(0, 0, 'inst_bg');
        bg.alpha = 0.5;
        bg.input.useHandCursor = true;
        
        var deviceSpecificKeys, deviceSpecificPause, deviceSpecificS;
        
        instbgsmall = this.add.sprite(130, 100, 'window');
        instbgsmall.scale.set(2, 1.2);
        
        nameLabel = this.game.add.text(170, 20, 'B  A  L  L  O  O  N     E  L  E  P  H  A  N  T', {
            font: '29px ' + font, fill: 'white', align: 'center',
            stroke: 'purple', strokeThickness: 12
        });
        
        if (this.game.device.desktop){
            deviceSpecificKeys = "Use Right & Left keys \n to Add & Release balloons!";
            deviceSpecificS = "Click";
            deviceSpecificPause = "Press 'P' to toggle pause";
            
            arrows = this.add.sprite(150, 140, 'arrows');
            arrows.scale.set(0.8, 0.8);
            arrows.alpha = 0.8;
        } 
        else{
            deviceSpecificKeys = "Swipe Right & Left \n to Add & Release balloons! ";
            deviceSpecificS = "Tap";
            deviceSpecificPause = "Double tap to toggle pause";
            
            swipe = this.add.sprite(150, 140, 'swipe');
            swipe.scale.set(0.8, 0.8);
            swipe.alpha = 0.6;
        } 
   /*
        fish = this.add.image(100, 190, 'fish');
        fish.scale.set(0.7,0.7);
        fishText = this.game.add.text(140, 220, "Fish \nPops all balloons", {
            font: '15px ' + font, fill: 'purple', fontWeight: 'normal', align: 'center'
        });
        
        bird = this.add.image(100, 320, 'bee');
        bird.scale.set(0.8,0.8);
        birdText = this.game.add.text(140, 350, "Bird \nPops one balloon", {
            font: '15px ' + font, fill: 'purple', fontWeight: 'normal', align: 'center'
        });
        
        pretzel = this.add.image(315, 200, 'pretzel');
        pretzel.scale.set(0.7,0.7);
        pretzelText = this.game.add.text(340, 240, "Big Pretzel \nAdds more time", {
            font: '15px ' + font, fill: 'darkgreen', fontWeight: 'normal', align: 'center'
        });
        
        pretzel_s = this.add.image(315, 330, 'pretzel_s');
        pretzel_s.scale.set(0.8,0.8);
        pretzelsText = this.game.add.text(340, 370, "Small Pretzel \nMakes you faster", {
            font: '15px ' + font, fill: 'darkgreen', fontWeight: 'normal', align: 'center'
        });
        
        cloud1 = this.add.image(520, 210, 'cloud1');
        cloud1.scale.set(0.7,0.7);
        cloud1Text = this.game.add.text(540, 260, "Small Cloud \nMakes you faster", {
            font: '15px ' + font, fill: 'darkblue', fontWeight: 'normal', align: 'center'
        });
        
        cloud2 = this.add.image(520, 340, 'cloud2');
        cloud2.scale.set(0.7,0.7);
        cloud2Text = this.game.add.text(540, 390, "Big Cloud \nMakes you slower", {
            font: '15px ' + font, fill: 'darkblue', fontWeight: 'normal', align: 'center'
        });
        
        balloon = this.add.sprite(200, 100, 'balloon_sprite');
        balloon.frame = 1;
        balloon.scale.set(0.7,0.7);
        */
        
        howToText = this.game.add.text(255, 140, 
            deviceSpecificKeys, {
            font: '27px ' + font, fill: 'darkgreen', fontWeight: 'normal', align: 'center',
            stroke: 'white', strokeThickness: 2
        });
        
        tornado = this.add.sprite(150, 250, 'tornado_sprite');

        howToText2 = this.game.add.text(210, 260, 
            "Finish the level before the tornado hits!", {
            font: '27px ' + font, fill: 'red', fontWeight: 'normal', align: 'center',
            stroke: 'white', strokeThickness: 2
        });
        
        balloon = this.add.sprite(200, 330, 'balloon_sprite');
        balloon.frame = 2;
        balloon.scale.set(0.7,0.7);
        
        howToText3 = this.game.add.text(260, 340, 
            "Don't drift off the screen...", {
            font: '27px ' + font, fill: 'purple', fontWeight: 'normal', align: 'center',
            stroke: 'white', strokeThickness: 2
        });
        
        pauseText = this.game.add.text(300, 475, 
           ""+deviceSpecificPause, {
            font: '17px ' + font, fill: 'blue', fontWeight: 'normal', align: 'center'
        });

        pressText = this.game.add.text(230, 520, 
            deviceSpecificS +  " anywhere to begin!", {
            font: '31px ' + font, fill: 'brown', fontWeight: 'normal', align: 'center',
            stroke: 'white', strokeThickness: 2
        });
        
        creditText = this.game.add.text(630, 530, 
            "A game by Johnny Tal \n w w w . j o h n n y t a l . c o m", {
            font: '10px ' + font, fill: 'darkblue', fontWeight: 'normal', align: 'center'
        });
        
        nameLabel.alpha = 0;
        game.add.tween(nameLabel).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        howToText.alpha = 0;
        game.add.tween(howToText).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        howToText2.alpha = 0;
        game.add.tween(howToText2).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        howToText3.alpha = 0;
        game.add.tween(howToText3).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
    },
    
    update: function(){
        if(game.input.activePointer.isDown){
            this.game.state.start("Levels");
            //clickFx.play(); 
        }  
    }
 };  