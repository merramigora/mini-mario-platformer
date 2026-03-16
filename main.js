const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreUI = document.getElementById("score");

let gravity = 0.5;
let score = 0;
let gameOver = false;
let win = false;

let player = {
    x:50,
    y:300,
    w:30,
    h:30,
    vx:0,
    vy:0,
    speed:4,
    jumping:false
};

let platforms = [
    {x:0,y:350,w:900,h:50},
    {x:200,y:300,w:120,h:20},
    {x:400,y:260,w:120,h:20},
    {x:600,y:220,w:120,h:20},
    {x:760,y:180,w:120,h:20}
];

let coins = [
    {x:230,y:260,w:15,h:15,collected:false},
    {x:430,y:220,w:15,h:15,collected:false},
    {x:630,y:180,w:15,h:15,collected:false}
];

let enemies = [
    {x:500,y:320,w:30,h:30,dir:1,speed:1.5}
];

let goal = {x:850,y:320,w:30,h:30};

let keys = {};

document.addEventListener("keydown", e=>keys[e.code]=true);
document.addEventListener("keyup", e=>keys[e.code]=false);

function rectCollision(a,b){
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function update(){

    if(gameOver || win) return;

    player.vx = 0;

    if(keys["ArrowLeft"]) player.vx = -player.speed;
    if(keys["ArrowRight"]) player.vx = player.speed;

    if(keys["Space"] && !player.jumping){
        player.vy = -10;
        player.jumping = true;
    }

    player.vy += gravity;

    player.x += player.vx;
    player.y += player.vy;

    for(let p of platforms){
        if(rectCollision(player,p)){
            if(player.vy > 0){
                player.y = p.y - player.h;
                player.vy = 0;
                player.jumping = false;
            }
        }
    }

    for(let c of coins){
        if(!c.collected && rectCollision(player,c)){
            c.collected = true;
            score += 10;
            scoreUI.innerText = score;
        }
    }

    for(let e of enemies){

        e.x += e.speed * e.dir;

        if(e.x < 450 || e.x > 650){
            e.dir *= -1;
        }

        if(rectCollision(player,e)){
            gameOver = true;
        }
    }

    if(rectCollision(player,goal)){
        win = true;
    }

    if(player.y > canvas.height){
        gameOver = true;
    }
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x,player.y,player.w,player.h);

    ctx.fillStyle = "green";
    for(let p of platforms){
        ctx.fillRect(p.x,p.y,p.w,p.h);
    }

    ctx.fillStyle = "yellow";
    for(let c of coins){
        if(!c.collected){
            ctx.fillRect(c.x,c.y,c.w,c.h);
        }
    }

    ctx.fillStyle = "brown";
    for(let e of enemies){
        ctx.fillRect(e.x,e.y,e.w,e.h);
    }

    ctx.fillStyle = "gold";
    ctx.fillRect(goal.x,goal.y,goal.w,goal.h);

    if(gameOver){
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER",350,200);
    }

    if(win){
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("YOU WIN!",360,200);
    }
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
