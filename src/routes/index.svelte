<style>
    /* html { height: 100%; overflow: auto; } */
    body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
        -webkit-font-smoothing: antialiased;
        /* font-family: "Helvetica", sans-serif; */
    }
    :root {
        --main-background-color: hsl(0deg 0% 15%);
        --main-text-color: white;
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
        transform: translateZ(-3.5px) scale(4.5);
    }
    .speed-3 {
        transform: translateZ(-2px) scale(3);
    }
    .speed-4 {
        /* transform: translateZ(-2.5px) scale(3.5); */
    }
    .speed-6 {
        transform: translateZ(0px) scale(1);
    }
    .sky {
        margin-top: -1px;
        height: 682px;
        background-image: url("blueSky2.jpg");
        background-color: var(--main-background-color);
    }
    .kayak {
        margin-top: 32px;
        height: 550px;
        background-image: url("kayak.png");
    }
    .monument {
        margin-top: -163px;
        margin-left: -75px;
        height: 550px;
        background-image: url("washMon.png");
    }
    .birds {
        margin-top: 49px;
        margin-left: 215px;
        height: 550px;
        background-image: url("birds2.png");
    }
    .ryne {
        margin-top: 97px;
        margin-left: -65px;
        height: 700px;
        background-image: url("ryne2.png");
    }
    .stream {
        margin-top: 254px;
        height: 500px;
        background-image: url("stream.png");
    }
    .iceland {
        margin-top: 181px;
        height: 500px;
        background-image: url("iceland.png");
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
    .text {
        width: clamp(100px, 90vw, 750px);
    }
    .navigation {
        /* margin-top: 681px; */
        position: sticky;
        top: 0;
        /* color: var(--main-text-color); */
        color: black;
        background-color: white;
        display: flex;
        justify-content: space-evenly;
    }
</style>
<body>
    <div id="parallax-container">
        <div class="object-wrapper speed-0">
            <div class="object sky"></div>
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
        <!-- <div class="object-wrapper speed-4"> -->
            <!-- <div class="navigation">
                TESTING
            </div> -->
        <!-- </div> -->
        <div class="object-wrapper speed-4">
            <div class="object content">
                <div class="text">
                    <div class="navigation">
                        <a href="" on:click={ () => window.scrollTo(0, 0) } >TOP</a>
                        <a>ABOUT</a>
                        <a>CONNECT</a>
                    </div>
                    Hi, I'm David (or Ryne)! I'm a Stockholm-based developer from Iowa City, IA, USA.
                    
                    <h1>about me</h1>
                    I graduated from the University of Iowa in 2007 with a B.S. in Biology. From 2008 to 20015 I worked a variety of biology-related jobs, trying to figure out what I enjoy doing. I relocated to Sweden with my wife in 2017 and decided to use the change of scenery to change fields from Biology to data and programming. From 2018-2019 I worked as a Data Analyst for Radisson Hotel Group in Sweden and currently work as a BI developer for Radisson Hotel Group in Belgium (while still being based in Sweden). I love learning new technologies and working with data.

                    We have a 1-year-old son and are currently living in Solna. In my spare time I like to hike, play board + video games, and learn new things.

                    <h1>about this site</h1>
                    This site was made using React.js (this is my first React project!), Typescript , Tailwindcss, and Echarts. You can find the source code here.
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