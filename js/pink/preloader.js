var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){ 
        // load font
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        
        // create progress % text
        this.progress = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 30, '0%',{
             font: '25px ' + font, fill: 'green', fontWeight: 'normal', align: 'center'
        });
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);
    
        // create progress bar
        var loadingBar = this.add.sprite(this.game.world.centerX - 55,  this.game.world.centerY + 40, "elephant");
        loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(loadingBar);
        
        // load assets
        this.game.load.image("finish_line", "assets/elephant/images/finish_line.png");
        this.game.load.image("pretzel", "assets/elephant/images/pretzel.png");
        this.game.load.image("pretzel_s", "assets/elephant/images/pretzel_speed.png");
        this.game.load.image("cloud1", "assets/elephant/images/cloud1.png");
        this.game.load.image("cloud2", "assets/elephant/images/cloud2.png");
        this.game.load.image("rain", "assets/elephant/images/rain.png");
        this.game.load.image("inst_bg", "assets/elephant/images/inst_bg.jpg");
        this.game.load.image("sea", "assets/elephant/images/sea.png");
        this.game.load.image("fish", "assets/elephant/images/fish.png");
        this.game.load.image("lighting", "assets/elephant/images/lighting.png");
        this.game.load.image("clock", "assets/elephant/images/clock.png");
       
        this.game.load.image("0star", "assets/elephant/images/pretzel_0star.png");
        this.game.load.image("1star", "assets/elephant/images/pretzel_1star.png");
        this.game.load.image("2star", "assets/elephant/images/pretzel_2star.png");
        this.game.load.image("3star", "assets/elephant/images/pretzel_3star.png");
        
        this.game.load.image("window", "assets/elephant/images/panel.png");
        this.game.load.image("ok", "assets/elephant/images/ok.png");
        this.game.load.image("menu", "assets/elephant/images/menu.png");
        this.game.load.image("replay", "assets/elephant/images/replay.png");
        this.game.load.image("lock", "assets/elephant/images/lock.png");
        this.game.load.image("arrows", "assets/elephant/images/arrows.png");
        this.game.load.image("swipe", "assets/elephant/images/swipe.png");

        this.game.load.spritesheet("bg","assets/elephant/images/blue_land.jpg", 1024 ,1024);
        this.game.load.spritesheet("numbers","assets/elephant/images/numbers.png", 28 ,160);
        this.game.load.spritesheet("Elephant_sprite","assets/elephant/images/Elephant_sprite.png", 49.4 ,43);
        this.game.load.spritesheet("tornado_sprite","assets/elephant/images/tornado_sprite.png",37 ,61);
        this.game.load.spritesheet("bee","assets/elephant/images/bird.png",60 ,46);
        this.game.load.spritesheet("balloon_sprite","assets/elephant/images/balloon_sprite.png",38 ,101);
        this.game.load.spritesheet("audioBtn","assets/elephant/images/audio.png",39 ,39);
        this.game.load.spritesheet("island","assets/elephant/images/island.png", 135, 33);
        //this.game.load.spritesheet("medals","assets/elephant/images/medals.png", 20, 36);

        this.game.load.audio('add_baloon', 'assets/elephant/audio/add_baloon.mp3'); 
        this.game.load.audio('bird', 'assets/elephant/audio/bird.mp3'); 
        this.game.load.audio('chew', 'assets/elephant/audio/chew.mp3'); 
        this.game.load.audio('click', 'assets/elephant/audio/click.mp3'); 
        this.game.load.audio('cloud', 'assets/elephant/audio/cloud.mp3'); 
        this.game.load.audio('deflate', 'assets/elephant/audio/deflate.mp3'); 
        this.game.load.audio('drowning', 'assets/elephant/audio/drowning.mp3'); 
        this.game.load.audio('end_level', 'assets/elephant/audio/end_level.mp3'); 
        this.game.load.audio('fish_splash', 'assets/elephant/audio/fish_splash.mp3'); 
        this.game.load.audio('lost', 'assets/elephant/audio/lost.mp3'); 
        this.game.load.audio('outofbounds', 'assets/elephant/audio/outofbounds.mp3'); 
        this.game.load.audio('pop_baloon', 'assets/elephant/audio/pop_baloon.mp3'); 
        this.game.load.audio('pop_bird', 'assets/elephant/audio/pop_bird.mp3'); 
        //this.game.load.audio('land_island', 'assets/elephant/audio/land_island.mp3'); 
        //this.game.load.audio('music', 'assets/elephant/audio/music.mp3'); 
    },
    
    create: function(){
        this.game.state.start("Instruct");  
    }
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text = progress+"%";
    console.log(progress, cacheKey, success);
};
