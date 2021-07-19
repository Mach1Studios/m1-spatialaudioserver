<template>
  <div id="main">
    <div class="containerOuter" style="display: none;">
      <div class="containerInner" style="min-height: 190px;">
        <input type="radio" name="mode" id="radio3" class="hidden" checked="checked" value="touch" onclick="selectTracker()">
        <label class="entry" for="radio3">
          <div class="circle"></div>
          <div class="entry-label">Touch</div>
        </label>

        <input type="radio" name="mode" id="radio1" class="hidden" value="facetracker" onclick="selectTracker()">
        <label class="entry" for="radio1">
          <div class="circle"></div>
          <div class="entry-label">Facetracker</div>
        </label>

        <div class="highlight"></div>
        <div class="overlay"></div>
      </div>
    </div>
    <div id="touchstats" style="margin:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50vw;height:auto;">
      <div class="background"><img src="https://demo.mach1.tech/img/touch-compass.svg" style="width:50vw;height:auto;max-height:50vh" /></div>
      <div class="cardBottom">
        <div id="touchstats:card" class="card">
          <div class="txt">FRONT</div>
        </div>
      </div>
    </div>
  </div>

  <div id="stats" style="position:absolute;bottom:5px;left:5px;"></div>
  <div id="info" style="position:relative; margin:auto; margin-top:41vh; text-align:center; font-size:3em;"></div>
</template>
<script>
export default {
  name: 'AudioPlayerTouch',
};
</script>
<style lang="scss" scoped>
  #main {
    max-height: 90vh;
  }
  .canvas-wrapper {
    display: inline-block;
    vertical-align: top;
  }

  .button {
    height: 31px;
    width: 100%;

    background-color: #5C5C5C;
    color: #ffffff;

    margin-bottom: 15px;
    border: 0px;

    font-weight: bold;
    font-style: normal;

    text-indent: 0;
    line-height: 31px;
    text-decoration: none;
    text-align: center;
  }

  .button:hover {
    background-color: #EEEEEE;
    color: #000000;
  }

  .showOverlay {
    display: flex;
    position: absolute;

    bottom: 0;
    left: calc(50% - 55px);

    margin-bottom: 7px;

    font-size: 16px;
  }

  #compass {
    height: 18vh;
  }

  #modelview,
  #compassContainer {
    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: 41vh;

    text-align: center;
  }

  #modelview {
    padding-top: 5vh;
  }

  #modelview canvas {
    background: transparent;
  }

  #warning {
    position: relative;

    padding: 1.5em;
    margin: auto;

    text-align: center;
    font-size: 2em;

    color: #5C5C5C;
  }

  #boseRate {
    min-width: fit-content;
    width: 100%;

    overflow: hidden;
  }

  .containerOuter {
    background: white;

    z-index: 5;

    border-radius: 8px;
    box-shadow: 2px 6px 20px 2px rgba(10, 10, 120, 0.15);
  }

  .containerInner {
    width: 160px;

    position: relative;
    margin: 20px;
  }

  .containerInner .button:last-child {
    margin-bottom: 5px;
  }

  .hidden {
    display: none;
  }

  .entry {
    height: 25px;
    width: 160px;

    position: absolute;
  }

  .entry:nth-child(2) {
    left: 8px;
    top: 8px;
  }

  .entry:nth-child(4) {
    left: 8px;
    top: 58px;
  }

  .entry:nth-child(6) {
    left: 8px;
    top: 108px;
  }

  .entry:nth-child(8) {
    left: 8px;
    top: 158px;
  }

  .circle {
    height: 20px;
    width: 20px;
    position: absolute;

    border: 2px solid #5C5C5C;
    border-radius: 50%;

    cursor: pointer;
    transition: border-color 300ms;
  }

  .entry-label {
    margin-top: 3px;
    padding-left: 40px;

    cursor: pointer;
    user-select: none;
    -moz-user-select: none;
  }

  .overlay {
    width: 40px;
    height: 140px;

    background: var(--hl-yellow);
    mask: url(#holes);
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACMCAYAAAAOc+uVAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAItSURBVHic7ZnNjhJBFIVPA0txr0Iyw+tIdOXWaDRufZWZeYbZuMKOUV9Gg+HHGN/BHBcNcSBT1KVOEVycb0mq635UVd9U5zQkif+Y3rkFclhQxYIqFlQZiM8vALQAPgP4AWC1+X0E4ALAFMBzAOPiCixjRfIdyX5g/h7JFyTnJYVKBGckHxQsxJBke2rBK5LF55bdal6fSnCmyO1JhlcyKrhkwbYekBySXNcUfF1L7o7k20jhhsxetxYAJk3T/Kks2EfXmkaHxkXO1MfacgCwmbPNjYsIftV1knzJDYgIfqsgkuJ7bkBE8FcFkRTr3IBzXxay9SOCjyuIFM8dEZxUECmeOyL4tIJIimluQKRRLwFcnqBRDwDMUaFRjwG8quC0zxtk5ACEL6wrksNaZiQfkvwZKRxtM08AfGDgBh2Q6wG4BfAo+sAxXB/xp+6VI3lzTMGSK3/Lgu1mt62fji1W+tH0m+R7dm9iZNVeMnjm9om0mUOs8O+zc47dz84Juh76DJG3NYEqeHLOfVnIYkEVC6pYUMWCKhZUsaCKBVUsqGJBFQuqWFDFgipO3OnEfRcn7qWCTtxTOHFP4cS9Ek7cVZy4qzhxL4ZO3AXoxF2QoxP3DifuW5y4q1hQxYIqFlSxoIoFVSyoYkEVC6pYUMWCKhZUsaCKE3c6cd/FiXupoBP3FE7cUzhxr4QTdxUn7ipO3IuhE3cBOnEX5OjEvcOJ+xYn7ioWVLGgigVV/gKEL4RSyM8Z8wAAAABJRU5ErkJggg==);

    pointer-events: none;
    transition: background 300ms;
  }

  .highlight {
    width: 12px;
    height: 12px;

    left: 14px;
    position: absolute;
    top: 14px;

    background: #5C5C5C;

    border-radius: 50%;
    pointer-events: none;
    transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2);
    transform: translateY(-50px);
  }

  .hidden:nth-child(1):checked~.highlight {
    transform: translateY(0);
  }

  .hidden:nth-child(3):checked~.highlight {
    transform: translateY(50px);
  }

  .hidden:nth-child(5):checked~.highlight {
    transform: translateY(100px);
  }

  .hidden:nth-child(7):checked~.highlight {
    transform: translateY(150px);
  }

  .hidden:nth-child(1):checked+.entry .circle {
    border-color: #5C5C5C;
  }

  .hidden:nth-child(3):checked+.entry .circle {
    border-color: #5C5C5C;
  }

  .hidden:nth-child(5):checked+.entry .circle {
    border-color: #5C5C5C;
  }

  .hidden:nth-child(7):checked+.entry .circle {
    border-color: #5C5C5C;
  }

  /* DatGUI Styling */
  .dg.main.taller-than-window .close-button {
    border-top: 1px solid #5C5C5C;
  }

  .dg.main .close-button {
    background-color: #5C5C5C;
    color: #fff;
  }

  .dg.main .close-button:hover {
    background-color: #5C5C5C;
  }

  .dg {
    color: #000;
    text-shadow: none !important;
  }

  .dg.main::-webkit-scrollbar {
    background: #fafafa;
  }

  .dg.main::-webkit-scrollbar-thumb {
    background: #bbb;
  }

  .dg li:not(.folder) {
    background: var(--hl-yellow);
    border-bottom: 1px solid #ddd;
  }

  .dg li.save-row .button {
    text-shadow: none !important;
  }

  .dg li.title {
    background: #e8e8e8 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;
  }

  .dg .cr.function:hover,
  .dg .cr.boolean:hover {
    background: #fff;
  }

  .dg .c input[type=text] {
    background: #e9e9e9;
  }

  .dg .c input[type=text]:hover {
    background: #eee;
  }

  .dg .c input[type=text]:focus {
    background: #eee;
    color: #555;
  }

  .dg .c .slider {
    background: #e9e9e9;
  }

  .dg .c .slider:hover {
    background: #eee;
  }

  .dg .c .slider-fg {
    background: #5C5C5C;
  }

  .dg .c .slider:hover .slider-fg {
    background: #000;
  }

  /* Disable left borders */
  .dg .cr.boolean {
    border-left: 3px solid #5C5C5C;
  }

  .dg .cr.color {
    border-left: 3px solid #5C5C5C;
  }

  .dg .cr.function {
    border-left: 3px solid #5C5C5C;
  }

  .dg .cr.number {
    border-left: 3px solid #5C5C5C;
  }

  .dg .cr.number input[type="text"] {
    color: #5C5C5C;
  }

  .svg-loader {
    height: 18vh;
  }

  // @import "compass/css3"

  .background img {
    width: 1200px;
    min-height: 100%;
    min-width: 100%;

    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    opacity: 0.6;

    -webkit-filter: grayscale(30%) blur(15px);
    -moz-filter: grayscale(30%) blur(15px);
    -ms-filter: grayscale(30%) blur(15px);
    -o-filter: grayscale(30%) blur(15px);
    filter: grayscale(30%) blur(15px);
  }

  .cardBottom {
    width: 480px;
    height: 320px;
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    transition: 0.4s;
    perspective: 1000px;
  }

  .cardBottom .card {
    width: 100%;
    height: 100%;
    position: absolute;

    top: 50%;
    left: 50%;
    margin: 0 auto;
    transform-origin: center center;
    transform: translate(-50%, -50%);

    transition: 0.2s;
    border: 10px solid #000;
  }

  .cardBottom .card .txt {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    padding: 10px;

    color: #000;
    border: 3px solid;

    font-size: 40px;
    text-align: center;
  }

  .cardBottom .card img {
    width: 100%;
    height: 100%;

    z-index: -1;
  }
</style>
