var levels = function(game){};

levels.prototype = {
    create: function(){
        bg = this.add.image(0, 0, 'inst_bg');
        bg.alpha = 0.15;
        
        pressText = this.game.add.text(200, 80, 
            "Choose a level to start from", {
            font: '35px ' + font, fill: 'red', fontWeight: 'normal', align: 'center',
            stroke: 'whitesmoke', strokeThickness: 8
        });

        audio_btn = this.add.button(720, 50, 'audioBtn', toggleSound, this);
        audio_btn.input.useHandCursor = true;
        if (game.sound.mute) audio_btn.frame = 1;
        
        var levels = [];
        var n_of_levels = 8;
       
        for (n=0; n < n_of_levels; n++){
            var bestScore = localStorage.getItem("elephant-record" + (n+1));
            var bestTime = localStorage.getItem("elephant-timeTakenRecord" + (n+1));
            var bestPercent = localStorage.getItem("elephant-percentRecord" + (n+1));
            var bestSpeed = localStorage.getItem("elephant-speedRecord2" + (n+1));
            
            var levelSprite;
            
            if (bestScore == null){
                bestScore = 0; 
                levelSprite = 'lock';
 
                if(localStorage.getItem("elephant-record" + n) != null || n == 0){
                    levelSprite = 'numbers';
                }
            } 
            else{
                levelSprite = 'numbers';
            }
            var space = 87;
            
            levels[n] = game.add.sprite(95 + (space * n), 200, levelSprite);
            levels[n].frame = n;
            levels[n].inputEnabled = true;
            levels[n].scale.set(1.8, 1.8);
           
            levels[n].input.useHandCursor = true;
           
            var best = game.add.sprite(95 + (space * n), 270, bestScore + 'star');
            best.scale.set(0.35,0.35);
            
            var timeLabel;
            if (bestTime == null){
                //bestTime = 0;
                timeLabel = '-';
            }
            else{ timeLabel = bestTime + ' secs'; }
            bestTimeLabel = this.add.text(100 + (space * n), 310, timeLabel, {
                font: '15px ' + font, fill: 'darkblue', fontWeight: 'normal', align: 'left'
            });
            
            var percentLabel;
            if (bestPercent == null){
                percentLabel = '-';
            }
            else{ percentLabel = bestPercent + '%' ; }
            bestPercentLabel = this.add.text(100 + (space * n), 370, percentLabel, {
                font: '15px ' + font, fill: 'darkgreen', fontWeight: 'normal', align: 'left'
            });
            
            var speedLabel;
            if (bestSpeed == null){
                speedLabel = '-';
            }
            else{ speedLabel = bestSpeed + ' mph' ; }
            bestSpeedLabel = this.add.text(100 + (space * n), 430, speedLabel, {
                font: '15px ' + font, fill: 'purple', fontWeight: 'normal', align: 'left'
            });
            
            clock = game.add.image(50, 305, 'clock');
            clock.scale.set(0.8, 0.8);
            
            pretzel = game.add.image(50, 365, 'pretzel');
            pretzel.scale.set(0.65, 0.65);
            
            lightning = game.add.image(50, 420, 'lighting');
        }
       
        for (x=0; x < n_of_levels; x++){
            levels[x].events.onInputDown.add(upload, this);
        }  
    },
    
    update: function(){

    },
};

function upload(_level){
    if (_level.key != 'lock'){
        clickFx.play();
        
        var start_level = (_level.frame + 1);
        attr.currentLevel = start_level;
        this.game.state.start("Game");
    }
}

function toggleSound(){
    if (game.sound.mute == false){
        game.sound.mute = true;
        audio_btn.frame = 1;
    }
    else{
        game.sound.mute = false;
        audio_btn.frame = 0;
    }
   
    audio_btn.input.useHandCursor = true;
}
