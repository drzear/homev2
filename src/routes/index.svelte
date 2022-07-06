<script>
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();

    let jackAge = curYear - 2019;
    if (curMonth < 8) {
        jackAge -= 1;
    } else if (curMonth == 8) {
        if (curDay <= 12) {
            jackAge -= 1;
        }
    }

    const scrollToTop = () => {
        document.getElementById('parallax-container').scrollTo(0,0);
    }
    const scrollToElement = (element) => {
        document.getElementById(element).scrollIntoView();
    }
</script>

<body>
    <div id="parallax-container">
        <div class="object-wrapper speed-0">
            <div class="object sky"></div>
        </div>
        <div class="object-wrapper speed-0">
            <div class="object hello">
                Hello👋
            </div>
        </div>
        <div class="object-wrapper speed-1">
            <div class="object kayak"></div>
        </div>
        <div class="object-wrapper speed-1">
            <div class="object monument"></div>
        </div>
        <div class="object-wrapper speed-3">
            <div class="object birds"></div>
        </div>
        <div class="object-wrapper speed-2">
            <div class="object iceland"></div>
        </div>
        <div class="object-wrapper speed-3">
            <div class="object stream"></div>
        </div>
        <div class="object-wrapper speed-4">
            <div class="object ryne"></div>
        </div>
        <div class="object-wrapper speed-4">
            <div class="object content">
                <div class="content-inner">
                    <div class="navigation">
                        <div class="nav-item" on:click={ () => scrollToTop() } >top</div>
                        <div class="nav-item" on:click={ () => scrollToElement('middle') }>about</div>
                        <!-- <div>connect</div> -->
                        <div class="nav-item" on:click={ () => scrollToElement('games') }>games</div>
                    </div>
                    <div class="text">
                        Hi, I'm David (or Ryne)! I'm a Stockholm-based developer from Iowa City, IA, USA.
                        
                        <div id="middle" class="columns">
                            <div class="column">
                                <h1>about me</h1>
                                I have a B.S. in Biology and worked a variety of biology-related jobs for 7 years. I relocated to Sweden in 2017 and decided to use the change of scenery to change fields from Biology to data and programming, working as an analyst and developer @ <a class="white-link" target="_blank" href="https://www.radissonhotels.com/en-us/corporate" title="Radisson Hotels">RHG</a> for 4 years. I currently work @ <a class="white-link" target="_blank" href="https://www.bestwestern.se/" title="Best Western Hotels">BWH Hotel Group</a> as a developer. I love learning new technologies and working with data.

                                <p>I have a {jackAge}-year-old son and live in Solna. In my spare time I like to hike, play board + video games, and learn new things.</p>
                            </div>
                            <div class="column">
                                <h1>about this site</h1>
                                This site was made as an excuse to play with parallax and Svelte 😁. You can find the source code <a class="white-link" target="_blank" href="https://github.com/drzear/homev2">here</a>.
                                You can check out my old React/Tailwind/react-spring/Echarts site <a class="white-link" target="_blank" href="https://drzear.github.io/">here</a>.
                                <h1>connect</h1>
                                You can find me here:
                                <div class="connect">
                                    <a class="white-link" target="_blank" href="https://www.linkedin.com/in/david-zear-68244910/">linkedin</a>
                                    <a class="white-link" target="_blank" href="https://github.com/drzear">github</a>
                                    <a class="white-link" target="_blank" href="mailto:drzear@gmail.com">gmail</a>
                                </div>
                            </div>
                        </div>

                        <h1 id="games">games</h1>
                        <a class="white-link" href="/games/snake">snake</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="framing-parent">
        <div class="framing left">
          <div class="fill"></div>
        </div>
        <div class="framing right">
          <div class="fill"></div>
        </div>
      </div>
</body>

<style>
    .connect {
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .columns {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
    }
    @media (max-width: 800px) {
        .columns {
            flex-direction: column;
        }
    }
    .column {
        flex: 50%;
        padding-left: 15px;
        padding-right: 15px;
    }
    /* html { height: 100%; overflow: auto; } */
    body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
        -webkit-font-smoothing: antialiased;
        background-color: var(--main-background-color);
        /* font-family: "Helvetica", sans-serif; */
    }
    .object-wrapper {
        width: 950px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 50%;
        margin-left: -475px;
        background: none;
    }
    .object {
        height: 700px;
        width: 950px;
        background-size: 100%;
        background-position: center top;
        background-repeat: no-repeat;
    }
    .speed-0 {
        transform: translateZ(-4.5px) scale(5.5);
    }
    .speed-1 {
        transform: translateZ(-4px) scale(5);
    }
    .speed-2 {
        transform: translateZ(-2.5px) scale(3.5);
    }
    .speed-3 {
        transform: translateZ(-1px) scale(2);
    }
    .sky {
        margin-top: -1px;
        height: 682px;
        background-image: url("/static/blueSky2.jpg");
        background-color: var(--main-background-color);
    }
    .kayak {
        margin-top: 32px;
        height: 550px;
        background-image: url("/static/kayak.png");
    }
    .monument {
        margin-top: -163px;
        margin-left: -75px;
        height: 550px;
        background-image: url("/static/washMon.png");
    }
    .birds {
        margin-top: 49px;
        margin-left: 215px;
        height: 550px;
        background-image: url("/static/birds2.png");
    }
    .iceland {
        margin-top: 181px;
        height: 500px;
        background-image: url("/static/iceland.png");
    }
    .stream {
        margin-top: 254px;
        height: 500px;
        background-image: url("/static/stream.png");
    }    
    .ryne {
        margin-top: 97px;
        margin-left: -65px;
        height: 700px;
        background-image: url("/static/ryne2.png");
    }
    .content {
        margin-top: 681px;
        background: var(--main-background-color);
        color: var(--main-text-color);
        text-align: center;
        clear: both;
        position: absolute;
        height: 3200px;
        overflow: visible;
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
    #parallax-container {
        position: absolute;
        perspective: 1px;
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100vw;
        overflow-x: hidden;
        overflow-y: auto;
        scroll-behavior: smooth;
        background: #c7cbb9;
    }
    #framing-parent {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100%;
        pointer-events: none;
    }
    .framing {
        pointer-events: none;
        z-index: 10000;
        position: absolute;
        top: 0px;
        bottom: 0px;
        height: 100%;
        top: 0px;
        bottom: 0;
        width: 100%;
        margin-bottom: -200px;
    }
    .framing .fill {
        width: 100%;
        height: 100%;
        background: var(--main-background-color);
        position: absolute;
    }
    .framing.left {
        left: -455px;
        margin-left: -50vw;
    }
    .framing.right {
        right: -455px;
        margin-right: -50vw;
    }
    .content-inner {
        width: clamp(100px, 100vw, 926px);
    }
    .text {
        /* width: clamp(100px, 90vw, 750px); */
        padding: 2vw;
        font-size: 17px;
    }
    .navigation {
        margin-top: -20px;
        position: sticky;
        top: 0;
        /* color: var(--main-text-color); */
        color: var(--main-background-color);
        background-color: var(--main-text-color);
        display: flex;
        justify-content: space-evenly;
        font-size: 21px;
        padding: 4px;
        opacity: 0.9;
    }
    .nav-item {
        cursor: pointer;
    }
    .hello {
        text-align: center;
        margin-top: 27px;
        font-size: 55px;
    }
    .white-link {
        color: var(--main-text-color);
    }
</style>