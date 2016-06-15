var game_over = function(game){};

game_over.prototype = {

    preload: function(){},
    
    init: function(score, reason, level, time_left, pretzels_percent, highest_speed, time_taken, records){
    var encourage = ["Don't give up!", 'Try again!', 'You almost made it!'];
    
    if (reason == 'end_game'){
        modal.createModal({
                type:"game_over",
                includeBackground: true,
                modalCloseOnInput: false,
                itemsArr: [
                     {
                        type: "image",
                        content: "window",
                        offsetY: 0,
                        offsetX: 0,
                        contentScale: 1.2
                    },
                    {
                        type: "text",
                        content: "Time's out...\n" + encourage[game.rnd.integerInRange(0,2)], 
                        fontFamily: font,
                        fontSize: 38,
                        color: "0xFEFF49",
                        offsetY: -70,
                        stroke: "0x000000",
                        strokeThickness: 5
                    },
                    {
                        type: "image",
                        content: "menu",
                        offsetY: 70,
                        offsetX: -50,
                        callback: function () {
                            attr.currentLevel = 1;
                            game.state.start('Instruct');
                        }
                    },
                    {
                        type: "image",
                        content: "replay",
                        offsetY: 70,
                        offsetX: 50,
                        callback: function () {
                            game.state.start('Game');
                        }
                    }
                ]
            });   
                
            modal.showModal("game_over");
            
            for (n=0; n<5; n++){
                game.add.tween(modal.getModalItem('game_over',n)).from({ y: - 800 }, 500, Phaser.Easing.Linear.In, true);
            }
    
            menuImg = modal.getModalItem('game_over',3);
            menuImg.input.useHandCursor = true;
            
            replayImg = modal.getModalItem('game_over',4);
            replayImg.input.useHandCursor = true;
        }
        
        else if(reason == 'end_level'){
            pretzels.forEach(function(item){
                item.destroy();
            });
            
            clouds.forEach(function(item){
                item.destroy();
            });
            
            fishes.forEach(function(item){
                item.destroy();
            });
        
            modal.createModal({
                type:"nextLevel",
                includeBackground: true,
                modalCloseOnInput: false,
                itemsArr: [
                    {
                        type: "image",
                        content: "window",
                        offsetY: 0,
                        offsetX: 0, 
                        contentScale: 1.9
                    },
                    {
                        type: "text",
                        content: "Level " + level + " Cleared!",
                        fontFamily: font,
                        fontSize: 30,
                        color: "0xFFFFF9",
                        offsetY: -215,
                        stroke: "0x000000",
                        strokeThickness: 6
                    },
                    {
                        type: "image",
                        content: 'clock',
                        offsetY: -150,
                        offsetX: -175,
                    },
                    {
                        type: "image",
                        content: 'pretzel',
                        contentScale: 0.8,
                        offsetY: -70,
                        offsetX: -175,
                    },
                    {
                        type: "image",
                        content: 'lighting',
                        contentScale: 0.9,
                        offsetY: 10,
                        offsetX: -175,
                    },
                    {
                        type: "text",
                        content: time_taken + " secs" + "   " + records[3],
                        fontFamily: font,
                        fontSize: 28,
                        color: "0xEDE6D5",
                        offsetY: -150,
                        offsetX: 10,
                        stroke: "0x000000",
                        strokeThickness: 4
                    },
                    {
                        type: "text",
                        content: pretzels_percent + "%" + "   " + records[1],
                        fontFamily: font,
                        fontSize: 28,
                        color: "0xDF9A55",
                        offsetY: -70,
                        offsetX: 10,
                        stroke: "0x000000",
                        strokeThickness: 4
                    },
                    {
                        type: "text",
                        content: highest_speed + " mph" + "   " + records[2],
                        fontFamily: font,
                        fontSize: 28,
                        color: "0xF3D96D",
                        offsetY: 10,
                        offsetX: 10,
                        stroke: "0x000000",
                        strokeThickness: 4
                    },
                    {
                        type: "image",
                        content: score+'star',
                        offsetY: 85,
                        contentScale: 0.9,
                        callback: function(){}  
                    },
                    {
                        type: "image",
                        content: "ok",
                        offsetY: 190,
                        offsetX: 0,
                        callback: function () {
                            if (attr.currentLevel < 8){
                                attr.currentLevel++;
                                attr.gameScore = score;
                                game.state.start('Game'); 
                            }
                            else{ // if there are no more levels, go back to levels screen
                                game.state.start('Levels');
                            }
                        }    
                    },
                    {
                        type: "image",
                        content: "menu",
                        offsetY: 190,
                        offsetX: 90,
                        callback: function () {
                            attr.currentLevel = 1;
                            game.state.start('Instruct');
                        }
                    },
                    {
                        type: "image",
                        content: "replay",
                        offsetY: 190,
                        offsetX: -90,
                        callback: function () {
                            game.state.start('Game'); 
                        }
                    },
                ]
            });
            modal.showModal("nextLevel");  
        
            ok = modal.getModalItem('nextLevel',10); 
            ok.input.useHandCursor = true;
            menu = modal.getModalItem('nextLevel',11); 
            menu.input.useHandCursor = true;
            replay = modal.getModalItem('nextLevel',12); 
            replay.input.useHandCursor = true;
           
            for (n=0; n<13; n++){
                game.add.tween(modal.getModalItem('nextLevel',n)).from({ y: - 800 }, 250, Phaser.Easing.Linear.In, true);
            }
        }
    }   
};