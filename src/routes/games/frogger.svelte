<script>
    import { onMount } from "svelte";

    const cols = [];
    const numCols = 20;
    let firstIdx = 0;
    while (firstIdx < numCols) {
        cols.push(firstIdx);
        firstIdx++;
    }
    let activePositions = [['safe1', 2]];

    let vehiclePositions = [];
    let logPositions = [];
    let lilypadPositions = [];
    let lives = [];
    let deaths = [];
    let finishedPositions = [];

    const vehicleLengths = [4, 5, 6, 7];
    const spaceLengths = [5, 6, 7];
    const streetOptions = ['street0', 'street1', 'street2', 'street3'];
    const riverOptions = ['river0', 'river1', 'river2', 'river3'];

    let increment;
    let timerDelay;
    let timers = [];
    let gameOver = false;
    let gameWon = false;

    let initialClientX = 0;
    let initialClientY = 0;
    let finalClientX = 0;
    let finalClientY = 0;

    let buttonControls = false;
    let gameStart = true; // switch to true
    let numberFood = 5;
    let fastMode = false;
    let continuousFood = true;
    let numberEaten = 0;

    let gamePaused = false;

    // TODO
    // separate normal and reverse vehicle generation (pass reverse to fn already started)
    // on each gameloop pop/unshift or reverse pop/unshift the street/river arrays to make infinite street
    // detect death (both in game loop and on frog move)
    // add goal and give new frog on goal reached
    // picture of frog instead of green oval

    const generateVehicles = (street, reverse = false) => {
        let position = -1000; // TODO increase?
        if (reverse) position = -numCols;
        while (position < (reverse ? numCols : 1000)) {
            if (position == -(reverse ? numCols : 1000 )) {
                if (Math.round(Math.random()) == 0) {
                    // vehicle
                    const vehicleLength = vehicleLengths[Math.floor(Math.random() * vehicleLengths.length)];
                    let iter = 0;
                    while (iter < vehicleLength) {
                        vehiclePositions.push([street, position]);
                        iter ++;
                        position ++;
                    }
                } else {
                    // no vehicle
                    const spaceLength = spaceLengths[Math.floor(Math.random() * spaceLengths.length)];
                    position += spaceLength;
                }
            } else {
                // must be vehicle
                const vehicleLength = vehicleLengths[Math.floor(Math.random() * vehicleLengths.length)];
                let iter = 0;
                while (iter < vehicleLength) {
                    vehiclePositions.push([street, position]);
                    iter ++;
                    position ++;
                }
                // generate space
                const spaceLength = spaceLengths[Math.floor(Math.random() * spaceLengths.length)];
                position += spaceLength;
            }
        }
    }
    const generateStreets = () => {
        vehiclePositions = [];
        streetOptions.forEach(street => {
            generateVehicles(street);
        });
    }

    const generateLogs = (street) => {
        let position = -1000; // TODO increase?
        while (position < 1000) {
            if (position == -1000) {
                if (Math.round(Math.random()) == 0) {
                    // vehicle
                    const vehicleLength = vehicleLengths[Math.floor(Math.random() * vehicleLengths.length)];
                    let iter = 0;
                    while (iter < vehicleLength) {
                        logPositions.push([street, position]);
                        iter ++;
                        position ++;
                    }
                } else {
                    // no vehicle
                    const spaceLength = spaceLengths[Math.floor(Math.random() * spaceLengths.length)];
                    position += spaceLength;
                }
            } else {
                // must be vehicle
                const vehicleLength = vehicleLengths[Math.floor(Math.random() * vehicleLengths.length)];
                let iter = 0;
                while (iter < vehicleLength) {
                    logPositions.push([street, position]);
                    iter ++;
                    position ++;
                }
                // generate space
                const spaceLength = spaceLengths[Math.floor(Math.random() * spaceLengths.length)];
                position += spaceLength;
            }
        }
    }
    const generateRivers = () => {
        logPositions = [];
        riverOptions.forEach(river => {
            generateLogs(river);
        });
    }

    const generateLilypads = () => {
        lilypadPositions = [];
        const incr = Math.round(numCols / 5);
        let idx = 1;
        let padNum = 0;
        while (idx < numCols && padNum < 4) {
            if (idx % incr == 0) {
                lilypadPositions.push(idx - 1);
                lilypadPositions.push(idx);
                padNum++;
            }
            idx++;
        }
    }

    const startNewGame = () => {
        generateStreets();
        generateRivers();
        generateLilypads();
        let iLives = 0;
        lives = [];
        while (iLives < 5) {
            lives.push(1);
            iLives ++;
        }
        deaths = [];
        finishedPositions = [];
        activePositions = [['safe1', 2]];
        gameOver = false;
        gameWon = false;
        gameStart = false;
        restartInterval();
    };

    const gameLoopStreetFn = (street, reverse = false) => {
        vehiclePositions.forEach(el => {
            if (el[0] == street) {
                if (reverse) {
                    el[1] --;
                } else {
                    el[1] ++;
                }
            }
        });
        vehiclePositions = vehiclePositions;
        // check for collision
        detectCollision(true, street);
        let keepPlaying = true;
        return keepPlaying;
    };
    const gameLoopRiverFn = (river, reverse = false) => {
        const newActivePositions = activePositions.map(arr => arr.slice()); 
        logPositions.forEach(el => {
            if (el[0] == river) {
                if (reverse) {
                    const activeIndex = activePositions.findIndex(pos => pos[0] == el[0] && pos[1] == el[1]);
                    if (activeIndex != -1) {
                        newActivePositions[activeIndex][1] --;
                    }
                    el[1] --;
                } else {
                    const activeIndex = activePositions.findIndex(pos => pos[0] == el[0] && pos[1] == el[1]);
                    if (activeIndex != -1) {
                        newActivePositions[activeIndex][1] ++;
                    }
                    el[1] ++;
                }
            }
        });
        activePositions = newActivePositions.map(arr => arr.slice());
        logPositions = logPositions;
        // check for collision
        detectCollision(false, river);
        let keepPlaying = true;
        return keepPlaying;
    };

    const startGame = () => {
        // street
        const gameLoop0 = setInterval(() => gameLoopStreetFn('street0'), 100);
        const gameLoop1 = setInterval(() => gameLoopStreetFn('street1', true), 500);
        const gameLoop2 = setInterval(() => gameLoopStreetFn('street2'), 200);
        const gameLoop3 = setInterval(() => gameLoopStreetFn('street3', true), 700);
        // river
        const gameLoop4 = setInterval(() => gameLoopRiverFn('river0', true), 100);
        const gameLoop5 = setInterval(() => gameLoopRiverFn('river1'), 500);
        const gameLoop6 = setInterval(() => gameLoopRiverFn('river2', true), 200);
        const gameLoop7 = setInterval(() => gameLoopRiverFn('river3'), 700);
        timers.push(gameLoop0, gameLoop1, gameLoop2, gameLoop3, gameLoop4, gameLoop5, gameLoop6, gameLoop7);
    };

    const restartInterval = () => {
        timers.forEach(interval => {
            clearInterval(interval);
        });
        timers = [];
        startGame();
    };
    onMount(() => {
        document.onkeydown = function (event) {
            if (!gameOver && !gameStart) {
                let char =
                    typeof event !== "undefined" ? event.keyCode : event.which;
                if (char === 38) {
                    onButtonPush('UP');
                } else if (char === 40) {
                    onButtonPush('DOWN');
                } else if (char === 37) {
                    onButtonPush('LEFT');
                } else if (char === 39) {
                    onButtonPush('RIGHT');
                }
            }
        };
    });
    const onButtonPush = (direction) => {
        if (direction == 'UP') {
            let newRow;
            switch (activePositions[0][0]) {
                case 'safe1':
                    newRow = 'street3';
                    break;
                case 'street3':
                    newRow = 'street2';
                    break;
                case 'street2':
                    newRow = 'street1';
                    break;
                case 'street1':
                    newRow = 'street0';
                    break;
                case 'street0':
                    newRow = 'safe0';
                    break;
                case 'safe0':
                    newRow = 'river3';
                    break;
                case 'river3':
                    newRow = 'river2';
                    break;
                case 'river2':
                    newRow = 'river1';
                    break;
                case 'river1':
                    newRow = 'river0';
                    break;
                case 'river0':
                    newRow = 'finish';
                    break;
                default:
                    newRow = activePositions[0][0];
                    break;
            }
            activePositions = [[newRow, activePositions[0][1]]];
        } else if (direction == 'LEFT') {
            if (activePositions[0][1] == 0) {
            } else {
                activePositions[0][1] -= 1;
                activePositions = activePositions;
            }
        } else if (direction == 'RIGHT') {
            if (activePositions[0][1] == numCols - 1) {
            } else {
                activePositions[0][1] += 1;
                activePositions = activePositions;
            }
        } else if (direction == 'DOWN') {
            let newRow;
            switch (activePositions[0][0]) {
                // case 'safe1':
                //     // newRow = 'street3';
                //     break;
                case 'street3':
                    newRow = 'safe1';
                    break;
                case 'street2':
                    newRow = 'street3';
                    break;
                case 'street1':
                    newRow = 'street2';
                    break;
                case 'street0':
                    newRow = 'street1';
                    break;
                case 'safe0':
                    newRow = 'street0';
                    break;
                case 'river3':
                    newRow = 'safe0';
                    break;
                case 'river2':
                    newRow = 'river3';
                    break;
                case 'river1':
                    newRow = 'river2';
                    break;
                case 'river0':
                    newRow = 'river1';
                    break;
                default:
                    newRow = activePositions[0][0];
                    break;
            }
            activePositions = [[newRow, activePositions[0][1]]];
        }
        detectCollision();
    }
    const detectCollision = (street = true, lane = undefined) => {
        const activePos = activePositions[0];
        let collision = false;
        if (!lane) {
            if (activePos[0] == 'finish') {
                if (!lilypadPositions.includes(activePos[1]) || finishedPositions.map(el => el[1]).includes(activePos[1]) || finishedPositions.map(el => el[1]).includes(activePos[1] - 1) || finishedPositions.map(el => el[1]).includes(activePos[1] + 1)) {
                    collision = true;
                } else {
                    finishedPositions = [...finishedPositions, activePositions.map(arr => arr.slice())[0]];
                    activePositions = [['safe1', 2]];
                    if (finishedPositions.length == 4) {
                        gameOver = true;
                        gameWon = true;
                    }
                }
            } else if (vehiclePositions.find(el => el[0] == activePos[0] && el[1] == activePos[1])) {
                collision = true;
            } else if (activePos[0].slice(0,5) == 'river' && !logPositions.find(el => el[0] == activePos[0] && el[1] == activePos[1])) {
                collision = true;
            }
        } else if (street) {
            if (vehiclePositions.filter(el => el[0] == lane).find(el => el[0] == activePos[0] && el[1] == activePos[1])) collision = true;
        }
        if (collision) {
            const gameOverBool = handleCollision();
            if (gameOverBool) {
                gameOver = true;
            } else {
                activePositions = [['safe1', 2]];
            }
        }
    }
    const handleCollision = () => {
        lives.pop();
        lives = lives;
        deaths.push(activePositions.map(arr => arr.slice())[0]);
        deaths = deaths;
        if (!lives.length) {
            return true;  // game over
        }
    }
    const handleTouchstart = (e) => {
        initialClientX = e.changedTouches[0].screenX;
        initialClientY = e.changedTouches[0].screenY;
    }
    const handleTouchmove = (e) => {
        finalClientX = e.changedTouches[0].screenX;
        finalClientY = e.changedTouches[0].screenY;
    };
    const handleTouchend = () => {
        const diffX = finalClientX - initialClientX;
        const diffY = finalClientY - initialClientY;
        if (!buttonControls) {
            if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
                onButtonPush('RIGHT');
            } else if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
                onButtonPush('LEFT');
            } else if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
                onButtonPush('DOWN');
            } else if (diffY < 0 && Math.abs(diffY) > Math.abs(diffX)) {
                onButtonPush('UP');
            } else {
                console.log({'initX': initialClientX, 'finalX': finalClientX, 'initY': initialClientY, 'finalY': finalClientY});
            }
            initialClientX = 0;
            initialClientY = 0;
        }
    };
    const pauseGame = () => {
        timers.forEach(interval => {
            clearInterval(interval);
        });
        timers = [];
        gamePaused = true;
    }
    const resumeGame = () => {
        gamePaused = false;
        restartInterval();
    }
</script>

{#if gameStart || gameOver}
    <div class="game-start">
        <div style="text-align: center;">
            {#if !gameOver}
                Welcome to Frogger!
            {:else if gameWon}
                You win!
            {:else}
                Game Over. Number eaten: {numberEaten}
            {/if}
        </div>
        <!-- <div style="font-size: 18px;">
            <label>
                <input type=checkbox bind:checked={buttonControls}>
                Show Button controls
            </label>
        </div>
        <div style="font-size: 18px;">
            <button on:click={() => numberFood ++}>/\</button>
            <button on:click={() => numberFood --}>\/</button>
            <label>
                <input type=number bind:value={numberFood} min=1 max=350 style="width: 80px;">
                Number of food on field
            </label>
        </div>
        <div style="font-size: 18px;">
            <label>
                <input type=checkbox bind:checked={fastMode}>
                Start at max speed
            </label>
        </div>
        <div style="font-size: 18px;">
            <label>
                <input type=checkbox bind:checked={continuousFood}>
                Continuously replenish food
            </label>
        </div> -->
        <div>
            <button class="new-game" on:click={startNewGame}>
                {gameOver ? 'Play Again' : 'Start'}
            </button>
        </div>
    </div>
{/if}
{#if gamePaused}
    <div class="game-start">
        <div style="text-align: center; font-size: 50px;">
            Paused! Number eaten so far: {numberEaten}
        </div>
        <div>
            <button class="new-game" on:click={resumeGame}>
                Resume
            </button>
        </div>
    </div>
{/if}
<div
    class="main-container"
    on:touchstart={handleTouchstart}
    on:touchmove={handleTouchmove}
    on:touchend={handleTouchend}
>
    <div style="width: 100%; color: white; display: flex; justify-content: center;">
        <div class="top-row">
            Lives: 
            {#each lives as life}
                <div class="lives game-col"></div>
            {/each}
        </div>
        <button on:click={pauseGame} class='pause-button'>Pause</button>
    </div>
    <div class="game-container">
        <div id="finish" class="game-row finish">
            {#each cols as col}
                <div
                    class:lilypad={lilypadPositions.findIndex(el => el == col) != -1}
                    class="game-col"
                >
                    {#if activePositions.findIndex(el => el[0] == 'finish' && el[1] == col) == 0}
                        <div class="active" />
                    {:else if finishedPositions.findIndex(el => el[0] == 'finish' && el[1] == col) != -1}
                        <div class="active"></div>
                    {:else if deaths.findIndex(el => el[0] == 'finish' && el[1] == col) != -1}
                        <div class="dead"></div>
                    {/if}
                </div>
            {/each}
        </div>
        <div id="river">
            <div class="game-row river-row">
                {#each cols as col}
                    <div
                        class:log={logPositions.findIndex(el => el[0] == 'river0' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'river0' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'river0' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row river-row">
                {#each cols as col}
                    <div
                        class:log={logPositions.findIndex(el => el[0] == 'river1' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'river1' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'river1' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row river-row">
                {#each cols as col}
                    <div
                        class:log={logPositions.findIndex(el => el[0] == 'river2' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'river2' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'river2' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row river-row">
                {#each cols as col}
                    <div
                        class:log={logPositions.findIndex(el => el[0] == 'river3' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'river3' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'river3' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
        <div class="game-row safe-zone">
            {#each cols as col}
                <div class="game-col" >
                    {#if activePositions.findIndex(el => el[0] == 'safe0' && el[1] == col) == 0}
                        <div class="active" />
                    {:else if deaths.findIndex(el => el[0] == 'safe0' && el[1] == col) != -1}
                        <div class="dead"></div>
                    {/if}
                </div>
            {/each}
        </div>
        <div id="street">
            <div class="game-row street-row street-row-top">
                {#each cols as col}
                    <div
                        class:vehicle={vehiclePositions.findIndex(el => el[0] == 'street0' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'street0' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'street0' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row street-row">
                {#each cols as col}
                    <div
                        class:vehicle={vehiclePositions.findIndex(el => el[0] == 'street1' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'street1' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'street1' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row street-row">
                {#each cols as col}
                    <div
                        class:vehicle={vehiclePositions.findIndex(el => el[0] == 'street2' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'street2' && el[1] == col) == 0}
                            <div class="active" />
                        {:else if deaths.findIndex(el => el[0] == 'street2' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="game-row street-row">
                {#each cols as col}
                    <div
                        class:vehicle={vehiclePositions.findIndex(el => el[0] == 'street3' && el[1] == col) != -1}
                        class="game-col"
                    >
                        {#if activePositions.findIndex(el => el[0] == 'street3' && el[1] == col) == 0}
                            <div class="active"/>
                        {:else if deaths.findIndex(el => el[0] == 'street3' && el[1] == col) != -1}
                            <div class="dead"></div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
        <div class="game-row safe-zone">
            {#each cols as col}
                <div class="game-col">
                    {#if activePositions.findIndex(el => el[0] == 'safe1' && el[1] == col) == 0}
                        <div class="active" />
                    {:else if deaths.findIndex(el => el[0] == 'safe1' && el[1] == col) != -1}
                        <div class="dead"></div>
                    {/if}
            </div>
            {/each}
        </div>
        <div id="start">

        </div>

        {#if buttonControls}
            <div class="controls">
                <div></div>
                <div></div>
                <div class="control-button" on:click={() => onButtonPush('UP')}>UP</div>
                <div></div>
                <div></div>

                <div></div>
                <div class="control-button" on:click={() => onButtonPush('LEFT')}>LEFT</div>
                <div></div>
                <div class="control-button" on:click={() => onButtonPush('RIGHT')}>RIGHT</div>
                <div></div>

                <div></div>
                <div></div>
                <div class="control-button" on:click={() => onButtonPush('DOWN')}>DOWN</div>
                <div></div>
                <div></div>
            </div>
        {/if}
    </div>
</div>

<style>
    #finish {
        background-color: lightblue;
    }
    .lilypad {
        height: min(min(8.5vw, 8.5vh), 50px);
        background-color: darkseagreen;
    }
    #river {
        background-color: lightblue;
    }
    .river-row {
    }
    .safe-zone {
        background-color: lightyellow;
    }
    #street {
        background-color: darkgray;
    }
    .street-row {
        border-top: 2px yellow dashed;
    }
    .street-row-top {
        border: none;
    }
    #start {
    }
    .top-row {
        display: flex;
        align-items: center;
    }
    .game-row {
        padding-top: 15px;
        padding-bottom: 15px;
        height: min(min(8.5vw, 5.5vh), 80px);
        display: flex;
        align-items: center;
    }
    .game-col {
        width: min(min(5vw, 5vh), 40px);
        display: flex;
        align-items: center;
    }
    .pause-button {
        margin-left: 10px;
        background-color: var(--main-text-color);
        color: var(--main-background-color);
    }
    .control-button {
        height: 40px;
        background-color: lightgoldenrodyellow;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .controls {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        width: 100%;
    }
    .new-game {
        background-color: var(--main-background-color);
        color: var(--main-text-color);
        height: 70px;
        width: 200px;
        font-weight: bold;
        font-size: 18px;
    }
    .game-start {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: var(--main-text-color);
        opacity: 0.95;
        font-size: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .lives {
        height: min(min(5.5vw, 5.5vh), 30px);
        border-radius: 50%;
        background-color: darkgreen;
    }
    .active {
        width: 100%;
        height: min(min(5.5vw, 5.5vh), 30px);
        border-radius: 50%;
        background-color: darkgreen;
    }
    .dead {
        width: 100%;
        height: min(min(5.5vw, 5.5vh), 30px);
        border-radius: 50%;
        background-color: red;
    }
    .vehicle {
        height: min(min(7.5vw, 7.5vh), 50px);
        background-color: black;
    }
    .log {
        height: min(min(5.5vw, 5.5vh), 30px);
        background-color: #a5512a;
    }
    .game-container {
        width: 98vw;
        height: 97vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 1vw;
        background-color: var(--main-background-color);
    }
    .main-container {
        width: 100%;
        height: 100%;
        background-color: var(--main-background-color);
    }
</style>
