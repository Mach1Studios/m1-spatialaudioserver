<template>
  <div class="field is-grouped is-grouped-multiline">
    <div class="field-label is-normal">
      <label class="label">filterSpeed</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="control">
          <input class="is-fullwidth" type="range" min="0" max="100" value="0">
          <div id="h4-container">
            <div id="h4-subcontainer">
              <h4>0<span></span></h4>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="input is-small is-rounded range-number" type="text" placeholder="0">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AudioPlayerSliders',
};
</script>
<style lang="scss" scoped>
  input[type="range"] {
    outline: 0;
    border: 0;
    border-radius: 500px;
    width: 100%;
    max-width: 100%;
    margin: 12px 0 16px;
    transition: box-shadow 0.2s ease-in-out;
    // Chrome
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      & {
        overflow: hidden;
        height: 10px;
        -webkit-appearance: none;
        background: #f5f5f5;
      }
      &::-webkit-slider-runnable-track {
        height: 10px;
        -webkit-appearance: none;
        color: #444;
        transition: box-shadow 0.3s ease;
      }
      &::-webkit-slider-thumb {
        width: 15px;
        -webkit-appearance: none;
        height: 10px;
        cursor: pointer;
        background: #fff7eb;
        box-shadow: -310px 0px 0px 305px #7a7a7a, inset 0 0 0 15px #7a7a7a;
        border-radius: 3em;
        transition: box-shadow 0.3s ease;
        position: relative;
        touch-action: manipulation;
      }
      &:active::-webkit-slider-thumb {
        background: #fff7eb;
        box-shadow: -310px 0px 0px 305px #7a7a7a, inset 0 0 0 2px #7a7a7a;
        border-radius: 3em;
        touch-action: manipulation;
      }
    }
    // Firefox
    &::-moz-range-progress {
      background-color: #43e5f7;
    }
    &::-moz-range-track {
      background-color: #9a905d;
    }
    // IE
    &::-ms-fill-lower {
      background-color: #43e5f7;
    }
    &::-ms-fill-upper {
      background-color: #9a905d;
    }

  }
  #h4-container {
    width: 100%;
    max-width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    #h4-subcontainer {
      width: 100%;
      position: relative;
      h4 {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        width: 40px;
        height: 40px;
        color: #1c1c1c !important;
        font-size: 12px;
        font-weight: bold;
        transform-origin: center -10px;
        transform: translateX(-50%);
        transition: margin-top 0.15s ease-in-out,
          opacity 0.15s ease-in-out;
        span {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #fff7eb;
          border-radius: 0 50% 50% 50%;
          transform: rotate(45deg);
          z-index: -1;
        }
      }
    }
  }
  input:not(:active) + #h4-container h4 {
    opacity: 0;
    margin-top: -50px;
    pointer-events: none;
  }
  .range-number {
    vertical-align: baseline;
    background-color: #1c1c1c;
    color: #fff7eb;
    font-weight: bold;
    text-align: center;
    width: 60px;
  }
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #fff7eb;
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #fff7eb;
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
    color: #fff7eb;
  }
</style>
