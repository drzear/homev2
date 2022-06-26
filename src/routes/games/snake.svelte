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
        while (foodPositions.length < 6) {
            const newFood = generateFood();
            if (newFood) foodPositions.push(newFood);
        }
    };
    fillFoodArray();

    const startNewGame = () => {
        initialPosition = 1009;
        activePositions = [initialPosition];
        increment = 1;
        timerDelay = 500;
        gameOver = false;
        foodPositions = [];
        fillFoodArray();
        startGame();
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

    startNewGame();

    const restartInterval = (inc) => {
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
</script>

<div class="container">
    {#if gameOver}
        <div class="game-over">
            Game Over =/
            <button class="new-game" on:click={startNewGame}>
                play again?
            </button>
        </div>
    {/if}
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
</div>

<style>
    .new-game {
        color: white;
        background-color: black;
    }
    .game-over {
        position: absolute;
        height: 100vh;
        width: 90vw;
        background-color: white;
        opacity: 0.8;
        font-size: 100px;
    }
    .row {
        display: flex;
        height: 40px;
    }
    .col {
        color: white;
        background-color: black;
        margin: 2px;
        width: 40px;
    }
    .active {
        background-color: yellow;
    }
    .food {
        background-color: red;
    }
    .container {
        width: 90vw;
        height: 97vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 5vw;
    }
</style>
