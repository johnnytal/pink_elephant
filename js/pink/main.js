var gameMain = function(game){};

gameMain.prototype = {
    preload: function(){ 
        HERO_GRAVITY_Y = 200;
        HERO_GRAVITY_X = 5;
        INIT_HERO_X = 100;
        INIT_HERO_Y = 100;
    
        BASE_ADD_X = 8;
        BASE_ADD_Y = 42;

        ROOM_WIDTH = get_level_name().width;
        
        time_left = get_time_left();
        time_taken = 0;
        
        HI_SPEED = 40;
        recordBroken = false;
        
        tornado_click = 0;
        tornado_timer = null;
        tintTimer = null;
        
        n_of_pretzels = 0;
        pretzels_taken = 0;
        neededAngle = 0;
        combo = 0;
    },
    
    create: function(){
        
        if (!this.game.device.desktop){
            try{ mc.destroy(); }catch(e){}
            
            screen = document.getElementById('game');
            mc = new Hammer(screen);
            mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 20 });
            
            mc.on("swiperight swipeup", function(ev) {
                if (!ev.handled && !game.paused) plus();   
            });
            
            mc.on("swipeleft swipedown", function(ev) {
                 if(!ev.handled && !game.paused) minus( game.rnd.integerInRange(100, 350) );;
            });
            
            mc.on('doubletap', function(ev) {
                togglePause();
            });
        }
        
        else{
            window.onkeydown = function(event) { 
                if (event.keyCode == 80) togglePause();
            }; 
        }
        
        bg = this.add.tileSprite(0, 0, ROOM_WIDTH, HEIGHT, 'bg');

        this.world.setBounds(0, 0, ROOM_WIDTH, HEIGHT);

        ground = this.add.sprite(0, HEIGHT - 1, null);
        this.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.setSize(ROOM_WIDTH, 1);
        ground.body.immovable = true;

        islands = game.add.group();
        islands.enableBody = true;
        islands.physicsBodyType = Phaser.Physics.ARCADE;
        
        island = islands.create(-20, 505, 'island');
        island.scale.set(1.15, 1);
        island.body.immovable = true;
        
        bees = game.add.group();
        bees.enableBody = true;
        bees.physicsBodyType = Phaser.Physics.ARCADE;
        
        fishes = game.add.group();
        fishes.enableBody = true;
        fishes.physicsBodyType = Phaser.Physics.ARCADE;

        pretzels = game.add.group();

        balloons = game.add.group();
        balloons.enableBody = true;
        balloons.physicsBodyType = Phaser.Physics.ARCADE;
        
        hero = game.add.sprite(INIT_HERO_X, INIT_HERO_Y, 'Elephant_sprite');
        hero.animations.add('run');
        this.physics.enable(hero, Phaser.Physics.ARCADE);
        hero.enableBody = true;
        hero.body.gravity.x = HERO_GRAVITY_X;       
        hero.body.gravity.y = HERO_GRAVITY_Y;
        hero.anchor.setTo(0.5, 0.5);
        
        sea = game.add.tileSprite(0, HEIGHT-84, ROOM_WIDTH, 84, 'sea');

        clouds = game.add.group();
        clouds.enableBody = true;
        clouds.physicsBodyType = Phaser.Physics.ARCADE;
        
        loadSfx();
        modal = new gameModal(game);

        if (attr.currentLevel > 1) createIslands();
        if (attr.currentLevel > 3) setTimeout(function(){
            createBees();
        }, game.rnd.integerInRange(get_level_name().beeTime * 1.25, get_level_name().beeTime * 1.85));
        if (attr.currentLevel > 4) createFishes();
        if (attr.currentLevel > 0) createPretzels();
        if (attr.currentLevel > 2) createClouds();
        if (attr.currentLevel > 5){
            bg.frame = 1;
            create_rain();
        }

        finish_line = this.add.image(-156, 548, 'finish_line');
        finish_line.fixedToCamera= true;

        elephant_icon = this.add.image(100, 565, 'elephant');
        elephant_icon.scale.set(0.35, 0.35);

        tornado_icon = this.add.sprite(0, 552, 'tornado_sprite');
        tornado_icon.scale.set(0.8, 0.8);
        tornado_icon.animations.add('run');
        
       /* var beginMessage;
        if (this.game.device.desktop) beginMessage = "Press right arrow to begin";
        else{ beginMessage = "Swipe right to begin"; };*/

        getReady = this.add.text(250, 150, 
        "Get ready for " + get_level_name().name + " !", 
        {
            font: '29px ' + font, fill: 'white', fontWeight: 'normal', align: 'center', stroke: '#0000f0',
            strokeThickness: 6
        });
        
        tip = this.add.text(400, 250,
        get_level_name().introduce,
        {
            font: '33px ' + font, fill: 'white', fontWeight: 'normal', align: 'center', stroke: 'green',
            strokeThickness: 5
        });
        
        tip.anchor.set(0.5, 0.5);
       
        game.add.tween(getReady).from({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        game.add.tween(tip).from({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

        levelLabel = this.add.text(718, 543, get_level_name().name, {
            font: '19px ' + font, fill: 'orange', fontWeight: 'normal', align: 'center',
            stroke: 'purple', strokeThickness: 2
        });
        levelLabel.fixedToCamera = true;
        levelLabel.addColor('#e59400', 6);
        
        pauseLabel = this.add.text(345, 40, 'Game Paused', {
            font: '26px ' + font, fill: 'magenta', fontWeight: 'normal', align: 'center'
        });
        pauseLabel.fixedToCamera = true;
        pauseLabel.visible = false;
        
        bestScore = localStorage.getItem("elephant-record" + attr.currentLevel);
        if (bestScore == null) bestScore = 0;
        best = this.add.sprite(720, 573, bestScore + 'star');
        best.scale.set(0.35, 0.35);
        best.fixedToCamera = true;
        
        bestPercent = localStorage.getItem("elephant-percentRecord" + attr.currentLevel);
        bestSpeed = localStorage.getItem("elephant-speedRecord2" + attr.currentLevel);
        bestTimeTaken = localStorage.getItem("elephant-timeTakenRecord" + attr.currentLevel);
        bestTime = localStorage.getItem("elephant-timeRecord" + attr.currentLevel);
        
       /* var label;
        if (bestTime == null){
            bestTime = 0;
            label = 'N/A';
        }
        else{ label = bestTime; }
        bestTimeLabel = this.add.text(760, 573, label, {
            font: '15px ' + font, fill: '#2D2D2D', fontWeight: 'normal', align: 'center'
        });
        bestTimeLabel.fixedToCamera = true;*/

        speedLabel = this.add.text(0, 0, '');
       
        if (attr.currentLevel == 1) createStartModal();
        
        phantom = this.add.sprite(hero.x, hero.y, null);
        this.physics.enable(phantom, Phaser.Physics.ARCADE);
        phantom.body.setSize(50, 50);
        phantom.body.immovable = true;
        
        game.camera.follow(phantom, Phaser.Camera.FOLLOW_LOCKON);

        cursors = game.input.keyboard.createCursorKeys();
        cursors.right.onDown.add(function(key){ if(!game.paused) plus(); }, this);
        cursors.left.onDown.add(function(key){ if(!game.paused) minus( game.rnd.integerInRange(100, 350) );; }, this);

        //musicFx.play();
    },
    
    update: function(){  
        // adjust elephant angle
        if (hero.angle < neededAngle) hero.body.angularVelocity += 0.1;
        else if (hero.angle > neededAngle) hero.body.angularVelocity -= 0.1;
        else{ hero.body.angularVelocity = 0; }

        // update progress bar icons
        elephant_icon.x = Math.round(hero.x / (ROOM_WIDTH/120) + 100);
        elephant_icon.x += Math.round(game.camera.x);
        
        tornado_icon.x = Math.round(hero.x / (ROOM_WIDTH/120)) + tornado_click;
        tornado_icon.x += Math.round(game.camera.x);
        
        // camera phantom
        phantom.body.velocity.x = hero.body.velocity.x;
        if (phantom.x < hero.x + (hero.body.velocity.x / 3)) phantom.x++;
        else if (phantom.x > hero.x + (hero.body.velocity.x / 2)) phantom.x--;
        
        // update balloons location
        for (i=0; i < balloons.length; i++) {
            balloons.children[i].x = hero.body.x + (60 - (balloons.countDead() * 7)) + (7 * i);
            balloons.children[i].y = hero.body.y + 45;

            scale_factor = 0.0009; // deflate balloons
            balloons.children[i].scale.setTo(
                balloons.children[i].scale.x -= scale_factor, 
                balloons.children[i].scale.y -= scale_factor / 2.5
            );

            if (balloons.children[i].alive && balloons.children[i].scale.x < 0.43){ // balloon deflate
                balloons.children[i].kill();
                deflateFx.play();

                hero.body.gravity.y += BASE_ADD_Y;
                hero.body.gravity.x -= BASE_ADD_X / 1.8;  
                
                hero.body.velocity.y += 20; 
                hero.body.velocity.x -= 40; 
                neededAngle += 1.7;
            }
        }
        
        // record speed
        var corrected_vel = Math.round(hero.body.velocity.x / 10);

        if (corrected_vel > HI_SPEED){
            HI_SPEED = corrected_vel;
            recordBroken = true;
        }
        
        if (recordBroken && corrected_vel < HI_SPEED && speedLabel.text == ''){
            speedLabel = game.add.text(
                hero.body.x - 40, 
                hero.body.y - 75, 
                HI_SPEED + " mph",        
                { font: '20px ' + font, fill: 'white', fontWeight: 'normal', align: 'center', stroke: '#000000',
                strokeThickness: 2 }
            );
            
            game.add.tween(speedLabel).to( { y: hero.body.y - 230 }, 1500, Phaser.Easing.Linear.In, true);
            game.add.tween(speedLabel).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
            
            setTimeout(function(){
                speedLabel.text = '';
                recordBroken = false;
            },1500);
        }
        speedLabel.x = hero.body.x - 40;
        
        // hero outOfBounds
        if (hero.body.y > 550) init_hero_attr('drown');
        if (hero.body.y < -50) init_hero_attr('out');
        if (hero.body.x < -15) init_hero_attr('out');
        if (hero.body.x > ROOM_WIDTH) kill_screen('end_level'); // next level
        
        // paint countdown 
        if (time_left < 5 && time_left > 4 || 
            time_left < 3 && time_left > 2 || 
            time_left < 1 && time_left > 0 ) finish_line.tint = 0xff0000;
        else { if (tintTimer == null) finish_line.tint = 0xffffff; }
        
        // fish flip
        fishes.forEach(function(fish){
            if (fish.body.velocity.y < 0) fish.angle += 1.5;
            if (fish.body.velocity.y > 0 && fish.angle > 0) fish.angle += 1.5;
            if (fish.inCamera && fish.y > HEIGHT - 50) fish_splashFx.play(); 
        });

        // collissions
        game.physics.arcade.collide(fishes, ground, null, null, this); 
        game.physics.arcade.collide(hero, islands, collide_hero_island, null, this); 
        
        islands.forEach(function(island){
            if (island.frame == 1){
                game.physics.arcade.collide(fishes, island, null, null, this); 
            }
        });

        if (tornado_timer != null){ // collide only if user started playing
            game.physics.arcade.collide(hero, bees, function(){
                minus(300);
                birdFx.play();
            }, null, this); 

            // overlaps
            pretzels.forEach(function(pretzel){
                if (isOverlapping(hero, pretzel)) overlap_pretzel_hero(hero, pretzel);
            });
            
            fishes.forEach(function(fish){
                if (isOverlapping(hero, fish)) overlap_fish_hero(hero, fish);
            });
    
            clouds.forEach(function(cloud){
                if (isOverlapping(hero, cloud)) overlap_cloud_hero(hero, cloud);
            });
            
            pretzels.forEach(function(pretzel){
                islands.forEach(function(island){ // avoid overlapping pretzels-islands
                    if (isOverlapping(pretzel, island)){
                        island.x += 4; island.y += 4;
                    }
                });
            });
        }
    },  
};

function plus(){
    if (count_balloons() < 6){
        
         if (attr.currentLevel == 1) modal.hideModal("new_game");
        
        rnd_n = attr.currentLevel;
        if (attr.currentLevel > 5) rnd_n = 5;
        rnd_baloon = game.rnd.integerInRange(0, rnd_n); 
        
        rnd_opacity = game.rnd.integerInRange(7, 9); 
        
        balloon = balloons.create(
            hero.body.x + (53 - (balloons.countDead()*7) ) + (7 * i),
            hero.body.y + 45,
            'balloon_sprite'
        );
        
        balloon.scale.set(0.6, 0.6); // inflate balloons
        game.add.tween(balloon.scale).to({ x: 1, y:1 }, 250, Phaser.Easing.Linear.In, true);
        
        balloon.frame = rnd_baloon;
        balloon.angle = 5 * ( count_balloons() );
        balloon.alpha = parseFloat('0.' + rnd_opacity);
        balloon.anchor.set(0.65, 1);
        
        hero.body.gravity.y -= BASE_ADD_Y;
        hero.body.gravity.x += BASE_ADD_X;   
        
        hero.body.velocity.y -= 80;   
        hero.body.velocity.x += 50;  
        
        neededAngle -= 1.8;

        hero.animations.play('run', 10, true, true);
        
        add_baloonFx.play();
        
        if (tornado_click == 0){
            tween_welocme_msg();
        
            timer_end_level(); // if you add balloon while tornado is at 0, start timer
            
            tornado_icon.animations.play('run', 10, true, true); 
            
            tornado_timer = game.time.events.loop(100, function(){ // advance tornado icon
                tornado_click += (75 / get_level_name().time) / 10;
            },this);
        } 
    }      
}

function minus(bal_vel){
    if (balloons.length != 0){
        for (var i=0; i < balloons.length; i++) {
            thisBaloon = balloons.children[i];  
        }
        
        newBalloon = game.add.sprite(thisBaloon.x, thisBaloon.y-120, 'balloon_sprite');
        newBalloon.frame = thisBaloon.frame;
        game.physics.enable(newBalloon, Phaser.Physics.ARCADE);
        newBalloon.enableBody = true;
        newBalloon.body.velocity.y = -bal_vel;
        newBalloon.body.gravity.x = -hero.body.gravity.x;
        newBalloon.body.angularVelocity = 15 * (hero.body.velocity.x / 150) ;
        newBalloon.scale = thisBaloon.scale;
        newBalloon.outOfBoundsKill = true;
        newBalloon.angle = thisBaloon.angle;
        game.add.tween(newBalloon).to({alpha: 0}, 1600, Phaser.Easing.Linear.None, true);
        
        thisBaloon.destroy();

        hero.body.gravity.y += BASE_ADD_Y;
        hero.body.gravity.x -= BASE_ADD_X / 1.8;   
        
        hero.body.velocity.y += 40; 
        hero.body.velocity.x -= 80; 
        
        neededAngle += 1.7;
    }
    
    else if (balloons.length == 0) hero.animations.stop(); 
 
    pop_baloonFx.play();
}

function collide_hero_island(_hero, _island){
    if (_hero.y < _island.y && _hero.x > _island.x){
        hero.body.velocity.x /= 2;
        hero.angle = 0;
        
        //land_islandFx.play();
    }
}

function overlap_fish_hero(_hero, _item){   
   if (balloons.length != 0){
       for (n=0; n < balloons.length; n++){
           minus(500);
       }
   }
}

function overlap_pretzel_hero(_hero, _item) {
    pretzels_taken++; 
    _item.destroy();
    
    chewFx.play();
    
    if (_item.key == 'pretzel'){
        var bonus_time = 3;
        
        time_left += bonus_time;
        tornado_click -= (70 / get_level_name().time) * bonus_time;
        
        finish_line.tint = 0xFFFFCC;
        
        tintTimer = setTimeout(function(){
            finish_line.tint = 0xffffff;  
            tintTimer = null; 
        },500);

        tween_bonus('clock');
    }
    
    else if (_item.key == 'pretzel_s'){
        _hero.body.velocity.x = Math.abs(_hero.body.velocity.x * 1.7);
        
        tween_bonus('lighting');
        
        endBonusSpeed = setTimeout(function(){        
            _hero.body.velocity.x /= 2;   
            endBonusSpeed = null;
        },1500);

       /* if (endBonusSpeed != null){
            combo++;
            if (combo > 1){
                comboMsg = game.add.text(335, 35, 'Combo X' + combo + '!',{
                    font: '23px ' + font, fill: 'white', fontWeight: 'normal', align: 'center', 
                    stroke: '#0000f0', strokeThickness: 1
                });
                comboMsg.fixedToCamera = true;
                
                game.add.tween(comboMsg).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
            }
        } */
    }
}

function overlap_cloud_hero(_hero, _item) { 
   if (init_angle = null) var init_angle = hero.angle;
   
   cloudFx.play();

   _hero.body.velocity.y += 3;

   if (_item.body.velocity.x > 0){
      _hero.body.velocity.x += 6;
       
   } 
   else if(_item.body.velocity.x < 0){
       _hero.body.velocity.x -= 6;
   }   
   
   if (_item.key == 'cloud1'){
       hero.body.angularVelocity *= 3;
       
       setTimeout(function(){
           hero.angle = init_angle;
           init_angle = null;
           hero.body.angularVelocity = 0;
       },500);
   }
   
   /*else if (_item.key == 'cloud2'){
      hero.body.angularVelocity *= -3; 
   }*/  

}

function kill_screen(reason){
   //musicFx.stop();
   
   hero.kill();
   balloons.removeAll();
   elephant_icon.kill();
   tornado_icon.kill();
   
   clearInterval(level_timer);
   try{ clearTimeout(endBonusSpeed); } catch(e){}
   
   if (reason == 'end_game'){
       lostFx.play();
   }
   else if (reason == 'end_level'){ 
       end_levelFx.play();
       
       var pretzels_percent = Math.round( (pretzels_taken / n_of_pretzels) * 100 ); 
       var highest_speed = HI_SPEED; 
        
       var score = 0;

       if (time_left > 0) score = 1; // give 1 pts for finishing on time
       if (time_left > get_level_name().time / 3) score = 2; // give 2 pts for finishing in 2/3 of the time
       if (time_left > get_level_name().time / 2) score = 3; // give 3 pts for finishing in half the time
    
       var time_left_round = Math.round(time_left * 10) / 10;
   }
   
   var distance_passed = Math.round(hero.x / ROOM_WIDTH) * 100 + '%';
   
   var time_taken_round = parseFloat(Math.round(time_taken * 10) / 10).toFixed(1);
   if (time_taken_round / 10)

   var level = attr.currentLevel;
   
   this.game.state.start(
       "Game_over", false, false,
       score, reason, level, time_left_round, pretzels_percent, highest_speed, time_taken_round,
       save_score(score, time_left_round, pretzels_percent, highest_speed, time_taken_round)
   );    
}

function init_hero_attr(reason){
    if (reason == 'drown' && !drowningFx.isPlaying ) drowningFx.play();
    else if (reason == 'out' && !outofboundsFx.isPlaying){ outofboundsFx.play(); }
    
    hero.body.velocity.x = 0; // to keep the hero from finishing level when drowned
    neededAngle = 0;
    game.camera.follow(null);
    
    try{clearInterval(init_slide);}catch(e){}
    
    init_slide = setInterval(function(){ // slide the camera back to position 0, and then init hero
        if( game.camera.x != 0) game.camera.x -= hero.x / 100;
        else{ attr_init_hero(init_slide); }
    },8);
}

function attr_init_hero(init_slide){
    clearInterval(init_slide);
    
    hero.x = INIT_HERO_X;
    hero.y = INIT_HERO_Y;
    phantom.x = INIT_HERO_X;
    
    hero.body.gravity.x = HERO_GRAVITY_X;       
    hero.body.gravity.y = HERO_GRAVITY_Y;
    
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;
    hero.angle = 0;
    phantom.body.velocity.x = 0;
    game.camera.follow(phantom, Phaser.Camera.FOLLOW_LOCKON);
    
    balloons.removeAll();   
}

function createFishes(){
    n_of_fishes = get_level_name().fish;
    
    for(n=1; n < n_of_fishes; n++){
        var start_y = 580;
        var start_x = game.rnd.integerInRange(INIT_HERO_X + 100, ROOM_WIDTH - 100); 
        var vel_y = game.rnd.integerInRange(-170, -350);

        fish = fishes.create(start_x, start_y, 'fish');

        fish.body.velocity.y = vel_y;  
        fish.body.gravity.y = 75; 
        fish.body.bounce.y = 1;   
        fish.body.mass = 0.5;
        fish.anchor.set(0.5, 0.5);
    }
}

function createBees(){
    var time_to_next = game.rnd.integerInRange(get_level_name().beeTime * 1.25, get_level_name().beeTime * 1.85);
    
    var start_y = game.rnd.integerInRange(50, 450);
    var start_x = game.rnd.integerInRange(WIDTH, ROOM_WIDTH - WIDTH);
    
    var vel_x = game.rnd.integerInRange(-40, -75) * (attr.currentLevel / 2) ;

    bee = bees.create(hero.x + start_x, start_y, 'bee');
    
    bee.body.velocity.x = vel_x;
    bee.body.immovable = true;
    
    bee.animations.add('run');
    bee.animations.play('run', 10, true, true);

    bee_timer = game.time.events.add(time_to_next, function(){
        createBees(); 
    }, this, []);
}

function createIslands(){
    n_of_islands = Math.round(ROOM_WIDTH / 900);
    
    for(n=0; n < n_of_islands; n++){
        var island_type = game.rnd.integerInRange(0, 2);
        
        var island_y;
        if (island_type != 1) island_y = game.rnd.integerInRange(65, 450); // make the islands fish collide with higher
        else { island_y = game.rnd.integerInRange(65, 300); }
        
        var island_x = game.rnd.integerInRange(INIT_HERO_X + 140, ROOM_WIDTH - 140);
        
        islands.forEach(function(item){
            if (Math.abs(item.x - island_x) < item.width && 
                Math.abs(item.y - island_y) < item.height)
            {
                island_x += item.width * 2;
                island_y += item.height * 2;
            } 
        });

        island = islands.create(island_x, island_y, 'island');
        island.frame = island_type;
        island.body.immovable = true;
    }
}

function createPretzels(){
    n_of_pretzels = Math.round(ROOM_WIDTH / 650);
    
    for(n=0; n < n_of_pretzels; n++){

        var start_y = game.rnd.integerInRange(100, 400);
        var start_x = game.rnd.integerInRange(200, ROOM_WIDTH - 100); 

        var rnd = game.rnd.integerInRange(0,10);
        
        pretzels.forEach(function(item){
            if (Math.abs(item.x - start_x) < item.width && 
                Math.abs(item.y - start_y) < item.height)
            {
                start_x += item.width * 2;  
                start_y += item.width * 2;  
            } 
        });
        
        if (rnd > 4 && attr.currentLevel > 1) pretzel = pretzels.create(start_x, start_y, 'pretzel');
        else if (rnd <= 4 || attr.currentLevel == 1)  pretzel = pretzels.create(start_x, start_y, 'pretzel_s');

        game.physics.enable(pretzel, Phaser.Physics.ARCADE);
        pretzel.enableBody = true;
        pretzel.anchor.set(0.5, 0.5);
        pretzel.body.angularVelocity = 250;        
    }
}

function createClouds(){
    var time_to_next = game.rnd.integerInRange(750, 4000);
    
    var start_x = game.rnd.integerInRange(100, ROOM_WIDTH - 100);
    var start_y = game.rnd.integerInRange(40, 450);
    
    var vel_x = game.rnd.integerInRange(-220, 220);
    if (vel_x < 50 && vel_x > 0) vel_x = 50;
    else if (vel_x > -50 && vel_x < 0) vel_x = -50;
     
    var cloud_alpha = game.rnd.integerInRange(4, 8);
    
    var cloud_to_create;
    if (vel_x <= 0) cloud_to_create = 2;
    else { cloud_to_create = 1; }

    cloud = clouds.create(start_x ,start_y, 'cloud'+cloud_to_create);
    
    cloud.body.velocity.x = vel_x;
    cloud.alpha = 0;
    game.add.tween(cloud).to( { alpha: parseFloat('0.' + cloud_alpha) }, 1000, Phaser.Easing.Linear.None, true);

    cloud_timer = game.time.events.add(time_to_next, function(){
        createClouds(); 
    }, this, []);
}

function timer_end_level(){
    level_timer = setInterval(function(){
        if (time_left >= 0) time_left -= 0.1;
        else if (time_left < 0){ 
            kill_screen('end_game'); 
        }
        time_taken += 0.1;
    }, 100);
}

function save_score(score, time, percent, speed, time_taken){ // if it's the best score ever, save it to local storage
    var recordTime = '';
    var recordPercent = '(Best: ' + bestPercent + '%)';;
    var recordSpeed = '(Best: ' + bestSpeed + ' mph)';;
    var recordTimeTaken = '(Best: ' + bestTimeTaken + ' secs)';

    if (score > bestScore){
        localStorage.setItem("elephant-record" + attr.currentLevel, score);  
    } 
    if (time > bestTime){
        localStorage.setItem("elephant-timeRecord" + attr.currentLevel, time);
        recordTime = 'NEW RECORD!';
    } 
    if (percent > bestPercent){
        localStorage.setItem("elephant-percentRecord" + attr.currentLevel, percent); 
        recordPercent = 'NEW RECORD!';
    } 
    if (speed > bestSpeed){
        localStorage.setItem("elephant-speedRecord2" + attr.currentLevel, speed);  
        recordSpeed = 'NEW RECORD!';
    } 
    if (time_taken < bestTimeTaken || bestTimeTaken == null || bestTimeTaken == undefined){
        localStorage.setItem("elephant-timeTakenRecord" + attr.currentLevel, time_taken); 
        recordTimeTaken = 'NEW RECORD!';
    } 
    
    var records = [recordTime, recordPercent, recordSpeed, recordTimeTaken];
    
    return records;
}

function createStartModal(){
    var text;
    var image;
    
    if (this.game.device.desktop){
        text = 'Right arrow key - go up \n Left arrow key - go down';
        text2 = 'Click anywhere';
        image = 'arrows';
    }
    else{
        text = 'Swipe Right - go up \n Swipe Left - go down';
        text2 = 'Tap anywhere';
        image = 'swipe';
    }
    modal.createModal({
        type:"new_game",
        includeBackground: true,
        modalCloseOnInput: true,
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
                content: text, 
                fontFamily: font,
                fontSize: 24,
                color: "0xF00E1F",
                offsetY: -85,
                stroke: "0xFFFFFF",
                strokeThickness: 3
            },
            {
                type: "text",
                content: text2, 
                fontFamily: font,
                fontSize: 20,
                color: "0x0000FF",
                offsetY: 105,
                stroke: "0xFFFFFF",
                strokeThickness: 2
            },
            {
                type: "image",
                content: image,
                offsetY: 20,
                offsetX: 0
            }
        ]
    });   
        
    modal.showModal("new_game");
    
    for (n=0; n<2; n++){
        game.add.tween(modal.getModalItem('new_game',n)).from({ alpha: 0 }, 750, Phaser.Easing.Linear.In, true);
    }
}

function count_balloons(){
    return balloons.length - balloons.countDead();
}

function isOverlapping(item_a, item_b){
    var boundsA = item_a.getBounds();
    var boundsB = item_b.getBounds();
    
    if (Phaser.Rectangle.intersects(boundsA, boundsB)) return true;
    else{ return false; }   
}

function get_level_name(){
   
    level_name = attr.levelAttr["level" + String(attr.currentLevel)];
    
    return level_name;
}

function get_time_left(){
    
    time_left = get_level_name().time;
    
    return time_left;
}

function tween_bonus(bonusSprite){
    pointsSprite = game.add.sprite(hero.body.x, hero.body.y - 200, bonusSprite);

    game.add.tween(pointsSprite).from( { y: hero.body.y }, 2200, Phaser.Easing.Linear.In, true);
    game.add.tween(pointsSprite).to( { x: hero.body.x + 400 }, 2400 - (hero.body.velocity.x * 1.5), Phaser.Easing.Linear.In, true);
    game.add.tween(pointsSprite).to( { alpha: 0 }, 3400 - (hero.body.velocity.x * 1.5), Phaser.Easing.Linear.None, true);
    game.add.tween(pointsSprite).to( { angle:'45' }, 600, Phaser.Easing.Linear.None, true, 100);
}

function loadSfx(){
    add_baloonFx = game.add.audio('add_baloon', 0.6, false);
    birdFx = game.add.audio('bird', 0.3, false);
    chewFx = game.add.audio('chew');
    cloudFx = game.add.audio('cloud');
    deflateFx = game.add.audio('deflate', 0.4, false);
    drowningFx = game.add.audio('drowning');
    end_levelFx = game.add.audio('end_level', 0.4, false);
    fish_splashFx = game.add.audio('fish_splash');
    lostFx = game.add.audio('lost');
    outofboundsFx = game.add.audio('outofbounds');
    pop_baloonFx = game.add.audio('pop_baloon', 0.7, false);
    pop_birdFx = game.add.audio('pop_bird');
    
    //land_islandFx = game.add.audio('land_island');
    //musicFx = game.add.audio('music', 0.9, true);
}

function togglePause(){
    if (!game.paused && hero.alive){
        game.paused = true;  
        pauseLabel.visible = true;
    } 
    else { 
        game.paused = false; 
        pauseLabel.visible = false;
    }    
}

function tween_welocme_msg(){
    game.time.events.add(1000, function() {
        game.add.tween(getReady).to({y: -600}, 750, Phaser.Easing.Linear.None, true);
        game.add.tween(getReady).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        
        game.add.tween(tip).to({y: -100}, 600, Phaser.Easing.Linear.None, true);
        game.add.tween(tip).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
    }, this);
}


function create_rain(){ // make it rain
    emitter = game.add.emitter(game.world.centerX, -100, 500);

    emitter.width = game.world.width;
    emitter.angle = game.rnd.integerInRange(10, 25);;

    emitter.makeParticles('rain');

    emitter.minParticleScale = 0.2;
    emitter.maxParticleScale = 0.6;

    emitter.setYSpeed(400, 600);
    emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1600, 5, 0);
}

