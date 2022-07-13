<script>
    import { onMount } from "svelte";

    const rows = [];
    const cols = [];
    let foodPositions = [];
    let idx = 0;
    while (idx < 21) {
        rows.push(idx * 100);
        cols.push(idx);
        idx++;
    }
    let initialPosition = 1009;
    let activePositions = [initialPosition];
    let increment;
    let timerDelay;
    let timers = [];
    let gameOver = false;

    let initialClientX = 0;
    let initialClientY = 0;
    let finalClientX = 0;
    let finalClientY = 0;

    let buttonControls = false;
    let gameStart = true;
    let numberFood = 5;
    let fastMode = false;
    let numberEaten = 0;

    const generateFood = () => {
        const newFoodPosition =
            rows[Math.floor(Math.random() * 20)] +
            cols[Math.floor(Math.random() * 20)];
        if (
            !foodPositions.includes(newFoodPosition) &&
            !activePositions.includes(newFoodPosition)
        ) {
            return newFoodPosition;
        }
    };
    const fillFoodArray = () => {
        while (foodPositions.length < numberFood) {
            const newFood = generateFood();
            if (newFood) foodPositions.push(newFood);
        }
    };
    fillFoodArray();

    const startNewGame = () => {
        initialPosition = 1009;
        activePositions = [initialPosition];
        increment = 1;
        timerDelay = fastMode ? 200 : 500;
        gameOver = false;
        gameStart = false;
        foodPositions = [];
        fillFoodArray();
        startGame();
        numberEaten = 0;
    };

    const gameLoopFn = () => {
        const lastPosition = activePositions[0];
        const nextPosition = lastPosition + increment;
        let keepPlaying = true;
        if (activePositions.includes(nextPosition)) {
            clearInterval(timers[0]);
            timers = [];
            gameOver = true;
            keepPlaying = false;
        }
        activePositions.unshift(nextPosition);
        if (!foodPositions.includes(nextPosition)) {
            activePositions.pop();
        } else {
            foodPositions = foodPositions.filter(
                (food) => food !== nextPosition
            );
            numberEaten += 1;
            fillFoodArray();
            timerDelay -= 10;
        }
        activePositions = activePositions;
        const currentRow = Math.floor(activePositions[0] / 100);
        const currentCol = +activePositions[0].toString().slice(-2);
        if (
            currentRow < 0 ||
            currentRow > 20 ||
            currentCol < 0 ||
            currentCol > 20
        ) {
            clearInterval(timers[0]);
            timers = [];
            gameOver = true;
            keepPlaying = false;
        }
        return keepPlaying;
    };

    const startGame = () => {
        const gameLoop = setInterval(gameLoopFn, timerDelay);
        timers.push(gameLoop);
    };

    // startNewGame();

    const restartInterval = () => {
        clearInterval(timers[0]);
        timers = [];
        const gameLoop = setInterval(gameLoopFn, timerDelay);
        timers.push(gameLoop);
    };
    onMount(() => {
        document.onkeydown = function (event) {
            if (!gameOver) {
                let char =
                    typeof event !== "undefined" ? event.keyCode : event.which;
                if (char === 38) {
                    // up
                    if (increment !== 100) {
                        increment = -100;
                        const keepPlaying = gameLoopFn();
                        if (keepPlaying) restartInterval();
                    }
                } else if (char === 40) {
                    // down arrow
                    if (increment !== -100) {
                        increment = 100;
                        const keepPlaying = gameLoopFn();
                        if (keepPlaying) restartInterval();
                    }
                } else if (char === 37) {
                    // left arrow
                    if (increment !== 1) {
                        increment = -1;
                        const keepPlaying = gameLoopFn();
                        if (keepPlaying) restartInterval();
                    }
                } else if (char === 39) {
                    // right arrow
                    if (increment !== -1) {
                        increment = 1;
                        const keepPlaying = gameLoopFn();
                        if (keepPlaying) restartInterval();
                    }
                }
            }
        };
    });
    const onButtonPush = (direction) => {
        if (direction == 'UP') {
            if (increment !== 100) {
                increment = -100;
                const keepPlaying = gameLoopFn();
                if (keepPlaying) restartInterval();
            }
        } else if (direction == 'LEFT') {
            if (increment !== 1) {
                increment = -1;
                const keepPlaying = gameLoopFn();
                if (keepPlaying) restartInterval();
            }
        } else if (direction == 'RIGHT') {
            if (increment !== -1) {
                increment = 1;
                const keepPlaying = gameLoopFn();
                if (keepPlaying) restartInterval();
            }
        } else if (direction == 'DOWN') {
            if (increment !== -100) {
                increment = 100;
                const keepPlaying = gameLoopFn();
                if (keepPlaying) restartInterval();
            }
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
        if (
            finalClientX < initialClientX &&
            Math.abs(finalClientY - initialClientY) < 50
        ) {
            onButtonPush('LEFT');
        } else if (
            finalClientX > initialClientX &&
            Math.abs(finalClientY - initialClientY) < 50
        ) {
            onButtonPush('RIGHT');
        } else if (
            finalClientY < initialClientY &&
            Math.abs(finalClientX - initialClientX) < 50
        ) {
            onButtonPush('UP');
        } else if (
            finalClientY > initialClientY &&
            Math.abs(finalClientX - initialClientX) < 50
        ) {
            onButtonPush('DOWN');
        }
        initialClientX = 0;
        initialClientY = 0;
    };
</script>

<div
    class="main-container"
    on:touchstart={handleTouchstart}
    on:touchmove={handleTouchmove}
    on:touchend={handleTouchend}
>
    <div class="game-container">
        {#if gameStart || gameOver}
            <div class="game-start">
                {#if !gameOver}
                    Welcome to Snake!
                {/if}
                {#if gameOver}
                    Game Over. Number eaten: {numberEaten}
                {/if}
                <div style="font-size: 18px;">
                    <label>
                        <input type=checkbox bind:checked={buttonControls}>
                        Show Button controls
                    </label>
                </div>
                <div style="font-size: 18px;">
                    <button on:click={() => numberFood ++}>/\</button>
                    <button on:click={() => numberFood --}>\/</button>
                    <label>
                        <input type=number bind:value={numberFood} min=1 max=50>
                        Number of Food on Field
                    </label>
                </div>
                <div style="font-size: 18px;">
                    <label>
                        <input type=checkbox bind:checked={fastMode}>
                        Start in Fast Mode
                    </label>
                </div>
                <div>
                    <button class="new-game" on:click={startNewGame}>
                        {gameOver ? 'Play Again' : 'Start'}
                    </button>
                </div>
            </div>
        {/if}
        <!-- {#if gameOver}
            <div class="game-over">
                
                <button class="new-game" on:click={startNewGame}>
                    play again?
                </button>
            </div>
        {/if} -->
        {#each rows as row}
            <div id="row" class="row">
                {#each cols as col}
                    <div
                        class:active={activePositions.includes(row + col)}
                        class:food={foodPositions.includes(row + col)}
                        class="col"
                    />
                {/each}
            </div>
        {/each}
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
        /* height: 40px; */
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
        font-size: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .row {
        display: flex;
        height: min(3vh, 40px);
    }
    .col {
        color: var(--main-background-color);
        background-color: var(--main-text-color);
        margin: 2px;
        width: min(3.5vw, 40px);
    }
    .active {
        background-color: cornflowerblue;
    }
    .food {
        background-color: goldenrod;
    }
    .game-container {
        width: 90vw;
        height: 97vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 5vw;
        background-color: var(--main-background-color);
    }
    .main-container {
        width: 100%;
        height: 100%;
        background-color: var(--main-background-color);
    }
</style>
