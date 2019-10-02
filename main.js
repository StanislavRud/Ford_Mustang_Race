const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    music = document.querySelector('.music'),
    // player = document.querySelector('.Player'),
    levelSpeed = document.querySelector('.speed');

let setting = {
    start: false,
    score: 0,
    speed: 2,
    traffic: 3
};

function selected () {
    let select = document.querySelector('.selectedDifficulty');
    let check = select.options[select.selectedIndex].value;
    return check;
}

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

function getQuantityElements(heightElement) {
   return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(){
    setting.speed = +selected();
    start.classList.add('hide');
    gameArea.style.display = 'block';
    score.style.display = 'block';
    levelSpeed.style.display = 'block';
    gameArea.innerHTML = '';
    music.src = '3.mp3';
    music.load();
    music.play();


    for (let i = 0; i < getQuantityElements(100) + 1; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        let enemyImg = Math.floor(Math.random() * 3) + 1;
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random()*(gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2 + 'px';
    car.style.top = 'auto';
    car.style.bottom = '10px'; 
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    requestAnimationFrame(playGame);
}

function playGame (){


    if (setting.start === true) {
        setting.score += setting.speed;

        setting.speed = +selected();

        let a = function gearup() {
            var b = setting.speed + 1;
            return b;
        };
        setting.speed = setInterval(a(), 10000);
        score.innerHTML = 'SCORE:' + setting.score;
        levelSpeed.innerHTML = 'SPEED:' + setting.speed * 10 + 'Km/h';
        if (setting.speed*10 < 50){
            levelSpeed.style.color = 'green';
        }
        if (50 < setting.speed*10 < 100 ){
            levelSpeed.style.color = 'orange';
        }
        if (setting.speed*10 > 100 ){
            levelSpeed.style.color = 'red';
        }

        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft === true && setting.x > 0){
            setting.x = setting.x - setting.speed;
            setting.rotate = 'rotate(-10deg)';
        }
        if (keys.ArrowRight === true && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x = setting.x + setting.speed;
            setting.rotate = "rotate(10deg)";
        }

        if (keys.ArrowDown === true && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y = setting.y + setting.speed;
            setting.rotate = "rotate(0deg)";
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y = setting.y - setting.speed;
            setting.rotate = "rotate(0deg)";
        }

    
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        car.style.transform = setting.rotate;
        requestAnimationFrame(playGame);
    }


}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
    setting.rotate = "rotate(0deg)";
}

function moveRoad (){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }

    });
}

function moveEnemy (){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top + 2 <= enemyRect.bottom &&
            carRect.right - 2>= enemyRect.left &&
            carRect.left + 2 <= enemyRect.right &&
            carRect.bottom - 2 >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.width = 100 + '%';
            start.style.margin = 0;
            start.style.left = 0;
            start.style.borderRadius = 0;
            start.innerHTML = 'GAME OVER<br>' + 'Click to start';
            music.src = '2.mp3';
            music.load();
            music.play();
    
        }

        item.y += setting.speed/2;
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random()*(gameArea.offsetWidth - 50)) + 'px';
        }

    });
}
