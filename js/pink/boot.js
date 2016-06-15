$(function(){   
    font = 'Chewy';
    WebFontConfig = {google: {families: [font]}}; // google webfont

    WIDTH = 800; 
    HEIGHT = 600; 
    
    w = window.innerWidth * window.devicePixelRatio;
    h = window.innerHeight * window.devicePixelRatio;
    
    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, "game");    
      
    game.state.add("Boot", boot);
    game.state.add("Preloader", preloader);
    game.state.add("Levels", levels);
    game.state.add("Instruct", instruct);
    game.state.add("Game", gameMain);
    game.state.add("Game_over", game_over);
    
    game.state.start("Boot");  
});

var boot = function(game){};
  
boot.prototype = {
    preload: function(){
          this.game.load.image("elephant", "assets/elephant/images/elephant.png");
    },
    create: function(){
        game.stage.backgroundColor = '#ffe1f0';
 
        //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 
        if (this.game.device.desktop){
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            var factor = 1.4;
            
            this.scale.maxWidth = w / factor; 
            this.scale.maxHeight = h / factor; 
            
            this.game.scale.pageAlignHorizontally = true;
            //this.game.scale.setScreenSize(true);
        } 
        
        else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.maxWidth = w;
            this.scale.maxHeight = h;
            
            this.scale.pageAlignHorizontally = true;
            this.scale.forceOrientation(false, true);
            
           // this.scale.setScreenSize(true);
        }

        game.state.start('Preloader');
    
    }
};
