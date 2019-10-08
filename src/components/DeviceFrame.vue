<template>
  <div id="iframeContainer" @click.self="closeiFrame()">
    <div id="FrameDimControls">
      <div
        class="deviceItmFrame"
        v-for="(device,index) in deviceBtns"
        :key="index"
        :class="{'selDevice':device.lbl==SelDeviceBtn.lbl}"
        @click="SetDeviceLayout(device)"
      >
        <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
      </div>
      <div class="ctrlZone">
        <span>Width:</span>
        <input
          type="range"
          class="FrameSlider"
          v-model="iFrame_Width"
          min="400"
          max="1024"
          @change="UpdateDevice()"
        />
        {{iFrame_Width}}
        <span class="dimLbl">px</span>
      </div>
      <div class="ctrlZone">
        <span>Height:</span>
        <input
          type="range"
          class="FrameSlider"
          v-model="iFrame_Height"
          min="400"
          max="1024"
          @change="UpdateDevice()"
        />
        {{iFrame_Height}}
        <span class="dimLbl">px</span>
      </div>
    </div>
    <div class="smartphone" :class="SelDeviceBtn.landSc?'lansc':'portrt'">
      <iframe
        :src="iFrameSrc"
        frameborder="0"
        id="ESQFrame"
        :style="'overflow:hidden;height:' + iFrame_Height +'px;width:' + iFrame_Width+'px;'"
      />
    </div>
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
      this.SelDeviceBtn.landSc = this.iFrame_Width > this.iFrame_Height;
    }
  }
};
</script>
<style scoped>
#iframeContainer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background: #a5a5a5;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  flex-direction: column;
  z-index: 999999;
  overflow: auto;
}

.FrameSlider {
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
}
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
  background: ghostwhite;
  width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
}
#FrameDimControls > input {
  margin: 0 5px;
}
.ctrlZone {
  margin: 0 5px;
  width: 45%;
  display: flex;
  justify-content: center;
}

.deviceItmFrame {
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