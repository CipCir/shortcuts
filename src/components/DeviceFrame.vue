<template>
  <div id="iframeContainer">
    <center @click.self="closeiFrame()">
      <div id="FrameDimControls" class="Frm_row">
        <div
          class="deviceItmFrame Frm_col"
          v-for="(device,index) in deviceBtns"
          :key="index"
          :class="{'selDevice':device.lbl==SelDeviceBtn.lbl}"
          @click="SetDeviceLayout(device)"
        >
          <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
        </div>
        <div class="ctrlZone Frm_col Frm_row">
          <span class="Frm_col">Width:</span>
          <input
            type="range"
            class="FrameSlider Frm_col"
            v-model="iFrame_Width"
            min="360"
            max="1024"
            @change="UpdateDevice()"
          />
          <span class="Frm_col">{{iFrame_Width}}</span>
          <span class="dimLbl Frm_col">px</span>
        </div>
        <div class="ctrlZone Frm_col Frm_row">
          <span>Height:</span>
          <input
            type="range"
            class="FrameSlider"
            v-model="iFrame_Height"
            min="360"
            max="1024"
            @change="UpdateDevice()"
          />
          <span class="Frm_col">{{iFrame_Height}}</span>
          <span class="dimLbl Frm_col">px</span>
        </div>
        <div class="ctrlZone Frm_col Frm_row">
          <span>Zoom:</span>
          <input
            type="range"
            class="FrameSlider"
            min="0.5"
            max="1"
            step="0.1"
            v-model="iFrame_scale"
          />
          <span class="Frm_col">{{iFrame_scale}}</span>
        </div>
      </div>

      <div id="TxtCont" class="Frm_row">
        <i class="fas fa-info-circle" style="margin-right:5px"></i>This is a simulation of a device screen, actual layout might vary on a real device.
      </div>

      <div
        class="smartphone"
        id="iFrameDiv"
        :class="SelDeviceBtn.landSc?'lansc':'portrt'"
        :style="'transform: scale('+iFrame_scale+');transform-origin:50% 0;'"
      >
        <iframe
          :src="iFrameSrc"
          frameborder="0"
          id="ESQFrame"
          :style="'overflow:hidden;height:' + iFrame_Height +'px;width:' + iFrame_Width+'px;'"
        />
      </div>
    </center>
    <div id="CloseFrame" @click="closeiFrame()">
      <i class="far fa-window-close"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "DeviceFrame",
  props: { initSelDeviceBtn: Object, deviceBtns: Array },
  data() {
    return {
      iFrameSrc:
        "https://media.ipsosinteractive.com/applications/SurveyShortcuts/FishTemplate.html",
      iFrame_Width: 411,
      iFrame_Height: 731,
      iFrame_scale: "1",
      SelDeviceBtn: { lbl: "", landSc: false }
    };
  },
  mounted() {
    this.SelDeviceBtn.lbl = this.initSelDeviceBtn.lbl;
    this.SelDeviceBtn.landSc = this.initSelDeviceBtn.landSc;
    this.iFrame_Width = this.initSelDeviceBtn.width;
    this.iFrame_Height = this.initSelDeviceBtn.height;
    if (document.domain == "localhost") {
      this.iFrameSrc = "FishTemplate.html";
    }
  },
  methods: {
    closeiFrame() {
      this.$emit("closeiFrame");
    },
    SetDeviceLayout(device) {
      //   this.addIframe = true;
      //   this.showDevices = false;
      this.iFrame_Width = device.width;
      this.iFrame_Height = device.height;
      this.SelDeviceBtn.width = device.width;
      this.SelDeviceBtn.height = device.height;
      this.SelDeviceBtn.lbl = device.lbl;
      this.SelDeviceBtn.landSc = device.landSc;
      this.$emit("updSelDeviceBtn", this.SelDeviceBtn);
      // JSON.parse(JSON.stringify(device));
    },
    UpdateDevice() {
      this.SelDeviceBtn.lbl = "";
      this.SelDeviceBtn.landSc =
        parseInt(this.iFrame_Width) > parseInt(this.iFrame_Height);
    }
  }
};
</script>
<style scoped>
.deviceItmFrame {
  width: 40px;
}
/* .Frm_row {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.Frm_row:after {
  content: "";
  display: table;
  clear: both;
}
.Frm_row .Frm_col {
  float: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 0.75rem;
  min-height: 1px;
} */

#TxtCont {
  /* margin: 0 auto; */
  width: 70%;
  background: white;
  color: black;
  padding: 5px;
  border-radius: 3px;
  margin: 5px;
}
#iframeContainer {
  /* display: flex; */
  /* align-items: center;
  justify-content: flex-start; */
  /* flex-direction: column; */
  height: 100vh;
  background: #a5a5a5;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999999;
  overflow: auto;
}

input[type="range"] {
  /* fix for FF unable to apply focus style bug  */
  border: 1px solid white;

  /*required for proper track sizing in FF*/
  width: 300px;
}

input[type="range"]::-moz-range-track {
  width: 300px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type="range"]::-moz-range-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: goldenrod;
}

/*hide the outline behind the border*/
input[type="range"]:-moz-focusring {
  outline: 1px solid white;
  outline-offset: -1px;
}

input[type="range"]:focus::-moz-range-track {
  background: #ccc;
}

input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 300px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: goldenrod;
  margin-top: -4px;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #ccc;
}

input[type="range"]::-ms-track {
  width: 300px;
  height: 5px;

  /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
  background: transparent;

  /*leave room for the larger thumb to overflow with a transparent border */
  border-color: transparent;
  border-width: 6px 0;

  /*remove default tick marks*/
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #777;
  border-radius: 10px;
}
input[type="range"]::-ms-fill-upper {
  background: #ddd;
  border-radius: 10px;
}
input[type="range"]::-ms-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: goldenrod;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #888;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #ccc;
}

/* .FrameSlider {
  -webkit-appearance: none;
  width: 170px !important;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  margin: 0 5px;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.FrameSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
}

.FrameSlider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
} */
#CloseFrame {
  position: fixed;
  top: 0;
  right: 20px;
  color: #f1d342;
  font-size: x-large;
  cursor: pointer;
}
#CloseFrame:hover {
  color: #faea9c;
}
#FrameDimControls {
  text-align: center;
  min-width: 637px;
  background: ghostwhite;
  width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  margin: 0 auto;
  font-weight: bold;
  box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
}
.ctrlZone > input {
  display: inline;
  width: 100px;
  margin: 0 5px;
}
.ctrlZone {
  margin: 0 5px;
  /* width: 30%; */
  display: inline;
  /* display: flex;
  justify-content: center; */
}

.deviceItmFrame {
  display: inline;
  background: lightblue;
  padding: 5px;
  cursor: pointer;
  text-align: left;
  border-bottom: solid 1px white;
  border-radius: 5px;
}

.deviceItmFrame:hover {
  background: lightseagreen;
}
.deviceItmFrame {
  margin: 0 3px;
}
.landSk {
  transform: rotate(270deg);
}
.MobCol {
  color: #1b364e;
}
.TablCol {
  color: #db6060;
}
.DeskCol {
  color: #475283;
}
.selDevice {
  background: white;
}
/* The device with borders */
#iFrameDiv {
  margin: 0 auto;
  display: inline-block;
}
.smartphone {
  position: relative;
  margin: auto;
  border: 16px black solid;
  border-radius: 36px;
}
.smartphone.lansc {
  border-left-width: 60px;
  border-right-width: 60px;
}
.smartphone.portrt {
  border-top-width: 60px;
  border-bottom-width: 60px;
}

/* The horizontal line on the top of the device */
.smartphone:before {
  content: "";
  display: block;
  width: 60px;
  height: 5px;
  position: absolute;
  background: #333;
  border-radius: 10px;
}
.portrt:before {
  top: -30px;
  left: 50%;
  transform: translate(-50%, -50%);
}
.lansc:before {
  top: 50%;
  left: -60px;
  transform: rotate(-90deg);
}

/* The circle on the bottom of the device */
.smartphone:after {
  content: "";
  display: block;
  width: 35px;
  height: 35px;
  position: absolute;

  background: #333;
  border-radius: 50%;
}
.portrt:after {
  left: 50%;
  bottom: -65px;
  transform: translate(-50%, -50%);
}
.lansc:after {
  top: 47%;
  right: -47px;
  transform: rotate(-90deg);
}

/* The screen (or content) of the device */
.smartphone .content {
  width: 360px;
  height: 640px;
  background: white;
}
</style>