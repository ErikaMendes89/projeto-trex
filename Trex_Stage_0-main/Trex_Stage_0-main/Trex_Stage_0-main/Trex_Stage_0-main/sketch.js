//const { group } = require("console");

var play = 1;
var end =0;
var gameState= play;
var pontos;

var trex ,trex_running, trex_collide;
// armazenar a imagem do solo
var groundImage;
var gameOverImg;
var restartImg;

function preload(){
  trex_running= loadAnimation("trex1.png", "trex3.png", "trex4.png");
  //carregar a imagem e atribuir a groundImage
  groundImage=loadImage("ground2.png");

  cloudImage=loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg=loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  trex_collide=loadImage("trex_collided.png"); 

  jumpSound= loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound= loadSound ("checkPoint.mp3");

}

function setup(){
  createCanvas(windowWidth,windowHeight);
  var mensagem = "Está é uma mensagem";
  console.log(mensagem)
  //crie um sprite de trex
  trex = createSprite(50, 70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collide);

  //crie um sprite Ground(solo)
  ground = createSprite(width/2, 190, 400, 20);
  //adicionou ao solo uma imagem
  ground.addImage("ground", groundImage);

  //criar um solo invisivel
  invisibleGround=createSprite(200, 190, 400, 20);
  invisibleGround.visible=false;
  

  //Criou um Grupo para os obstaculos e para as nuvens
 obstacleGroup = new Group();
 cloudsGroup = new Group();

 GameOver=createSprite(200, 180, 100, 100);
 GameOver.addImage(gameOverImg);
 
 restart=createSprite(200, 90, 10, 10);
 restart.addImage(restartImg);

restart.scale = 0.5;

 GameOver.scale = 0.5;



  //adicione dimensão e posição ao trex
  trex.scale= 0.5;
  trex.x = 50;

  pontos=0;
}

function draw(){
  background("white")


            
  if(gameState === play){
    GameOver.visible= false;
    restart.visible=false;
    
     ground.velocityX = -4;

     pontos = pontos + Math.round(getFrameRate()/60);
     text("Pontuação:  " + pontos, 500, 50);

     if(ground.x<0){
      ground.x= ground.width/2;

     }

     if(keyDown("space") && trex.y >=100){
      trex.velocityY= -13;
      jumpSound.play();
  
    }

    trex.velocityY = trex.velocityY + 0.8;

    //Chamar a função gerar nuvens
  spawClouds();

  spawObstacles();

  if(obstacleGroup.isTouching(trex)){
    gameState=end;
}


  }else if(gameState === end){
    ground.velocityX = 0;
     
    GameOver.visible =true;
    restart.visible=true;
    
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    
    trex.changeAnimation("collide", trex_collide);
   

    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }



  }

 

//impedir que o trex caia
trex.collide(invisibleGround);
trex.setCollider("circle", 0, 0, 40);
trex.debug = false


  drawSprites();

}

function spawClouds(){
    if(frameCount % 60 === 0){
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10, 60));
    cloud.scale=0.4;
    cloud.velocityX = -3;
     
    cloud.lifetime = 200;

     cloud.depth = trex.depth;
     trex.depth= trex.depth + 1;
    //console.log(trex.depth);
    //console.log(cloud.depth);

    cloudsGroup.add(cloud);
    }
}

function spawObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -6;


    var rand = Math.round(random(1,6));
    switch(rand){
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
      default:break;
      

     }

     obstacle.scale= 0.5;
     obstacle.lifetime = 300;

     //adicioanndo cada obstaculo dentro de um grupo.
     obstacleGroup.add(obstacle);
  } 
}

//função resetar
function reset(){
  gameState = play;
  GameOver.visible = false;
  restart.visible = false;
  pontos=0;

  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

}