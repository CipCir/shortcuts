<template>
  <div id="iframeContainer">
    <table id="CtrlTable">
      <tr>
        <td v-for="(device,index) in deviceBtns" :key="index">
          <span
            class="deviceItmFrame Frm_col"
            :class="{'selDevice':device.lbl==SelDeviceBtn.lbl}"
            @click="SetDeviceLayout(device)"
          >
            <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
          </span>
        </td>
        <td>Width:</td>
        <td class="CstmSlideCont">
          <vue-slider
            v-model="iFrame_Width"
            :contained="true"
            :min="360"
            :max="1024"
            tooltip="none"
            @change="UpdateDevice()"
          />
        </td>
        <td>{{iFrame_Width}} px</td>
        <td>Height:</td>
        <td class="CstmSlideCont">
          <vue-slider
            v-model="iFrame_Height"
            :contained="true"
            :min="360"
            :max="1024"
            tooltip="none"
            @change="UpdateDevice()"
          />
        </td>
        <td>{{iFrame_Height}} px</td>
        <td>Zoom:</td>
        <td class="CstmSlideCont">
          <vue-slider
            v-model="iFrame_scale"
            :contained="true"
            :min="5"
            :max="10"
            tooltip="none"
            @change="UpdateDevice()"
          />
        </td>
        <td>{{iFrame_scale/10}} px</td>
      </tr>
    </table>
    <center @click.self="closeiFrame()">
      <div id="TxtCont" class="Frm_row">
        <i class="fas fa-info-circle" style="margin-right:5px"></i>This is a simulation of a device screen, actual layout might vary on a real device.
      </div>

      <div
        class="smartphone"
        id="iFrameDiv"
        :class="SelDeviceBtn.landSc?'lansc':'portrt'"
        :style="'transform: scale('+iFrame_scale/10+');transform-origin:50% 0;'"
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
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  name: "DeviceFrame",
  components: {
    VueSlider
  },
  props: { initSelDeviceBtn: Object, deviceBtns: Array },
  data() {
    return {
      value: 0,
      iFrameSrc:
        "https://media.ipsosinteractive.com/applications/SurveyShortcuts/FishTemplate.html",
      iFrame_Width: 411,
      iFrame_Height: 731,
      iFrame_scale: 10,
      SelDeviceBtn: { lbl: "", landSc: false }
    };
  },
  // created() {
  //   $("head").append(
  //     "<link href='https://media.ipsosinteractive.com/deploy/templates/iis-sharky/v3.0-unm/css/jquery-ui/1.11.1/jquery-ui.min.css' rel='stylesheet' type='text/css' /><script src='https://media.ipsosinteractive.com/deploy/templates/iis-sharky/v3.0-unm/js/jquery-ui/1.11.1/jquery-ui.min.js' />"
  //   );
  // },
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
.spanLbl {
  display: inline-block;
  min-width: 50px;
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
  min-width: 740px;
  background: ghostwhite;
  width: 70%;
  margin-bottom: 10px;
  padding: 10px 0;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  margin: 0 auto;
  font-weight: bold;
  box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
}

.ctrlZone {
  margin: 0 5px;
  /* width: 30%; */
  /* display: inline; */
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
.CstmSlideCont {
  width: 150px;
}
table {
  margin: 10px;
  border-spacing: 5px;
  border-collapse: separate;
  background: white;
  margin: 0 auto;
}

td {
  background: white;
}
</style>