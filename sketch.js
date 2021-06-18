var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage,cloudImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var losingSound, cheersound, dingsound;

var loser,loser1,loser2;

function preload(){
  trex_running =   loadAnimation("trex.png");
  trex_collided = loadAnimation("trex.png");
  
  groundImage = loadImage("trex bg5.png");
  
  cloudImage = loadAnimation("butterfly.png","butter1.png");
  cloudImg = loadAnimation("butterfly.png");
  
  obstacle1 = loadImage("rock.png");
  obstacle2 = loadImage("rock1.png");
  obstacle3 = loadImage("rock2.png");
  obstacle4 = loadImage("rock3.png");
  obstacle5 = loadImage("rock4.png");
  obstacle6 = loadImage("rock5.png");
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart-1.png");
  
  losingSound = loadSound("losing sound.mp3");
  cheersound = loadSound("clap.mp3");
  dingsound = loadSound("ding2.mp3");
  
  loser1 = loadImage("loser.png");
}

function setup() {
  createCanvas(600,200);
  
  trex = createSprite(50,180,20,50);
  //trex.debug = true;
  trex.setCollider("circle",150,-50,70);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;
  
  ground = createSprite(200,190,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  loser = createSprite(540,-50,10,10);
  loser.addImage(loser1);
  loser.scale=0.15;
  
  loser2 = createSprite(45,-50,10,10);
  loser2.addImage(loser1);
  loser2.scale=0.15;
  
  gameOver = createSprite(300,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("white");
  
  if (gameState===PLAY){
  
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      dingsound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.65;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    if(score>500){
      cheersound.play();
    }
    if(score>550){
      cheersound.stop();
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      losingSound.play();
    }
  }
  else if (gameState === END) {
    cheersound.stop();
    
    loser.velocityY=3;
    loser2.velocityY=3;
    
    gameOver.visible = true;
    restart.scale=0.1;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  if(mousePressedOver(restart) && gameState===END)
  { 
    reset();
  }
  
  drawSprites();
  fill("white");
  stroke("white");
  textSize(15);
  text("Score: "+ score, 500,30);
}

function reset()
{
  gameState=PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  restart.visible=false;
  gameOver.visible=false;
  
  score=0;
  
  loser.y=-50;
  loser2.y=-50;
  loser.velocityY=0;
  loser2.velocityY=0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(50,100));
    cloud.addAnimation("cloud",cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -5;
    
     //assign lifetime to the variable
    cloud.lifetime = 230;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,175,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    obstacle.debug = false;
    obstacle.setCollider("rectangle",0,0,500,500);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.14;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

