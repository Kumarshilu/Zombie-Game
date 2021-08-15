var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var life = 3;

var zombieGroup;
var bullet = 100;
var bulletImg;
var bulletGroup;
var lose, win, explosion;
var gameState = "play"


function preload() {

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bulletImg = loadImage("assets/bullet.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  lose = loadSound("lose.mp3")

  win = loadSound("win.mp3")

  explosion = loadSound("explosion.mp3")

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)


  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage("heart1", heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage("heart2", heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth - 150, 40, 20, 20)
  heart3.addImage("heart3", heart3Img)
  heart3.scale = 0.4


  //creating group for zombies    
  zombieGroup = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(0);
  if (gameState === "play") {
    if (life === 3) {
      heart3.visible = true
      heart2.visible = false
      heart1.visible = false

    }
    if (life === 2) {
      heart3.visible = false
      heart2.visible = true
      heart1.visible = false
    }
    if (life === 1) {
      heart3.visible = false
      heart2.visible = false
      heart1.visible = true
    }
    if (life === 0) {
      gameState = "End"
    }
    if (score == 90) {
      gameState = "win"
      win.play();
    }
  }

  //moving the player up and down and making the game mobile compatible using touches
  if (keyDown("UP_ARROW") || touches.length > 0) {
    player.y = player.y - 30
  }
  if (keyDown("DOWN_ARROW") || touches.length > 0) {
    player.y = player.y + 30
  }
  if (keyDown("LEFT_ARROW") || touches.length > 0) {
    player.x = player.x - 30
  }
  if (keyDown("RIGHT_ARROW") || touches.length > 0) {
    player.x = player.x + 30
  }


  //release bullets and change the image of shooter to shooting position when space is pressed
  if (keyWentDown("space")) {

    player.addImage(shooter_shooting)
    bullet = createSprite(displayWidth - 1085, player.y - 25, 5, 5)
    bullet.addImage(bulletImg);
    bullet.velocityX = 10;
    bulletGroup.add(bullet);
    player.depth = bullet.depth;
    player.depth += 2;
    explosion.play()

  }

  //player goes back to original standing image once we stop pressing the space bar
  else if (keyWentUp("space")) {
    player.addImage(shooterImg)


  }
  if (bullet === 0) {
    gameState = "End"
    lose.play()
  }

  //destroy zombie when player touches it
  if (zombieGroup.isTouching(player)) {
    lose.play()


    for (var i = 0; i < zombieGroup.length; i++) {

      if (zombieGroup[i].isTouching(player)) {
        zombieGroup[i].destroy()
        life = life - 1;
      }
    }
  }
  //destroy zombi with bullet
  if (zombieGroup.isTouching(bulletGroup)) {
    


    for (var i = 0; i < zombieGroup.length; i++) {

      if (zombieGroup[i].isTouching(bulletGroup)) {
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        explosion.play()
        score += 1;
      }
    }
  }
  //calling the function to spawn zombies
  enemy();

text ("bullet = " + bullet, displayWidth -150, 50);
text ("life = " + life, displayWidth -150, 60);
text ("score = " + score, displayWidth -15, 70);

if(gameState = "End"){
  text("You Lost", 400, 400);
  zombieGroup.destroyEach();
  player.destroy();
}

if(gameState = "Win"){
  text("You Win", 400, 400);
  zombieGroup.destroyEach();
  player.destroy();
}
  drawSprites();
}



//creating function to spawn zombies
function enemy() {
  if (frameCount % 50 === 0) {

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(500, 1100), random(100, 500), 40, 40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug = true
    zombie.setCollider("rectangle", 0, 0, 400, 400)

    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }

}