<template>
  <div id="appMainCont" v-if="activateModule">
    <div id="drawer">
      <div id="slideBtn" class="clickable" @click="slideClick()" v-html="slideBtns[slideBtnIndx]"></div>
      <div id="fakeContent" v-if="!showDrawer"></div>
      <div id="drawerContent" :class="showDrawer?'slideUP':'slideDown'">
        <div id="listCont" v-if="showDevices">
          <div
            class="deviceItm"
            v-for="(device,index) in deviceBtns"
            :class="device.lbl==SelDeviceBtn.lbl?'selDevice':''"
            :key="index"
            @click="SetDeviceLayout(device)"
          >
            <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
            <span class="devList">{{device.lbl}}</span>
          </div>
        </div>
        <!-- <div id="deviceBtn" class="actBtn" @click="openDevices()">
          <i class="fas fa-chalkboard-teacher"></i>
          <span class="bntLabel">Device Preview</span>
        </div>-->
        <div
          v-for="(btn,indx) in actionBtns"
          :key="indx"
          class="actBtn"
          :class="btn.cls"
          @click="DoBtnAction(btn.action)"
        >
          <span class="icnCont">
            <i :class="btn.icon"></i>
          </span>

          <span class="bntLabel">{{btn.lbl}}</span>
        </div>
        <div id="helpBtn" @click="DoBtnAction('openInfo')">
          <i class="fas fa-info-circle"></i>
        </div>
      </div>
    </div>
    <!-- iFrame structure -->
    <DeviceFrame
      v-if="addIframe"
      :initSelDeviceBtn="SelDeviceBtn"
      :deviceBtns="deviceBtns"
      v-on:closeiFrame="CloseiFrame()"
      v-on:updSelDeviceBtn="UpdateSelDeviceBtn($event)"
    />
    <!-- Modal structure -->
    <div v-if="showModal" id="vueModBackCont" @click.self="closeModal()">
      <div id="vueModMainCont" :class="{'makeSmall':ModalContent==2}">
        <div id="vueModHeader">
          <span class="close-button">
            <i class="fa fa-times-circle float-right" aria-hidden="true" @click="closeModal()"></i>
          </span>
        </div>
        <div id="vueModContent" v-if="ModalContent==1">
          <center>
            <div
              id="instr"
            >Please find below a list all available question names, click to select/deselect the questions you wish to preview</div>
          </center>
          <div id="CtrlCont">
            Filter questions:
            <input type="text" v-model="ViewQFilter" />
            <i id="clearField" class="far fa-times-circle" @click="ViewQFilter=''"></i>
          </div>
          <div id="QBtnCont">
            <div
              class="qContainer"
              :class="{'selectedQ':SelViewQ.indexOf(qName)>-1}"
              v-for="(qName,indx) in filViewQuestions"
              :key="indx"
              @click="AddQ(qName)"
            >
              <span class="qName">{{qName}}</span>
            </div>
          </div>
        </div>
        <div id="vueModFooter" v-if="ModalContent==1">
          <div id="PrevBtn" @click="GotoPreviewQ()">Preview questions</div>
        </div>
        <div id="vueModContent" style="padding:2px" v-if="ModalContent==2">
          <h3>Available functionalities</h3>You can find below a description for each functionality and the assigned keyboard combination:
          <table id="TblAnswCont">
            <tr>
              <th>Icon</th>
              <th>Description</th>
              <th>Keboard shortcut</th>
            </tr>
            <tr v-for="(elmn,elIndx) in actionBtns" :key="elIndx" class="functRow">
              <td>
                <span class="mockActBtn">
                  <i :class="elmn.icon"></i>
                </span>
              </td>
              <td>{{elmn.desc}}</td>
              <td>
                <b>{{elmn.keyb}}</b>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- Random data loader -->
    <RandomData
      v-if="LoadRandomData"
      :SubmitPage="ActionSubmit"
      v-on:unsetRandomData="UnLoadRandomData($event)"
    />
    <!-- Preview MsgContainer -->
    <div id="PrevMSGContainer" v-if="QinESQ">
      <div id="ESQPreview">
        <span id="PrevText" class="container">
          <i class="far fa-eye"></i>
          <b>This is a preview of the question</b>. (Some text insers and images might not be displayed )
          <i class="far fa-eye"></i>
        </span>
      </div>
      <div id="ESQPrevErr" v-if="inESQ_errPreview">
        <span class="container">
          The selected question can't be previewed.
          <br />
          <span
            v-if="inESQ_errRandom"
            id="RandomDErr"
          >Random data didn't work, you need to manually answer the question and submit the page.</span>
          <span v-else>Please use the '{{actionBtns[3].lbl}}' button and go through the link.</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { debuglog } from "util";
import DeviceFrame from "./components/DeviceFrame.vue";
import RandomData from "./components/RandomData.vue";
export default {
  name: "app",
  components: {
    DeviceFrame,
    RandomData
  },
  data() {
    return {
      activateModule: false,
      addIframe: false,

      showDrawer: false,
      showBtns: false,
      showModal: false,
      ModalContent: 1,
      slideBtnIndx: 0,
      showDevices: false,
      slideBtns: [
        '<i class="far fa-caret-square-up"></i>',
        '<i class="far fa-caret-square-down"></i>'
      ],
      actionBtns: [
        {
          lbl: "Device Preview",
          icon: "fas fa-chalkboard-teacher",
          action: "openDevices",
          cls: "hideSmall",
          desc:
            "Open question in mobile device simulation (available on Desktop only)",
          keyb: "Ctrl + E"
        },
        {
          lbl: "Question preview",
          icon: "far fa-eye",
          action: "preview",
          cls: "",
          desc: "Jump to a preview for selected questions",
          keyb: "Ctrl + Q"
        },
        {
          lbl: "Show/hide precodes",
          icon: "fas fa-code",
          action: "codes",
          cls: "",
          desc: "Show/hide precodes",
          keyb: "Ctrl + S"
        },
        {
          lbl: "Random data",
          icon: "fas fa-random",
          action: "randomData",
          cls: "",
          desc: "Set a random answer for the current question",
          keyb: "Ctrl + R"
        },
        {
          lbl: "Forward",
          icon: "fas fa-step-forward",
          action: "navNext",
          cls: "",
          desc: "Set a random answer and navigate to next question",
          keyb: "Ctrl + Z"
        }
      ],
      deviceBtns: [
        {
          lbl: "Mobile Portrait",
          icon: "fas fa-mobile-alt",
          action: "mobPortrait",
          color: "MobCol",
          width: 360,
          height: 640,
          landSc: false
        },
        {
          lbl: "Mobile Landscape",
          icon: "fas fa-mobile-alt",
          action: "mobLandscape",
          color: "MobCol",
          width: 640,
          height: 360,
          landSc: true
        },
        {
          lbl: "Tablet Portrait",
          icon: "fas fa-tablet-alt",
          color: "TablCol",
          action: "TabPortrait",
          width: 767,
          height: 1024,
          landSc: false
        },
        {
          lbl: "Tablet Landscape",
          icon: "fas fa-tablet-alt",
          action: "TabLandscape",
          color: "TablCol",
          landSc: true,
          width: 1024,
          height: 767
        }
      ],
      SelDeviceBtn: { lbl: "" },
      CodesAreShowed: true,
      ViewQuestions: [],
      ViewQFilter: "",
      QSeenArr: [],
      SelViewQ: [],
      sortBtns: [
        { icon: "fa-sort-alpha-up", srt: "asc" },
        { icon: "fa-sort-alpha-down", srt: "desc" },
        { icon: "fa-file-export", srt: "file" }
      ],
      ActiveSort: "file",
      currQName: null,
      curQIndex: null,
      LoadRandomData: false,
      ActionSubmit: false,
      QinESQ: false,
      inESQ_errPreview: false,
      inESQ_errRandom: false
    };
  },
  created() {
    let vueOBJ = this;
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.log("err");
      vueOBJ.QinESQ = typeof inESQ != "undefined";
      vueOBJ.initializeApp();
      vueOBJ.inESQ_errPreview = true;
    };

    $(function() {
      console.log("ready");
      vueOBJ.QinESQ = typeof inESQ != "undefined";
      vueOBJ.initializeApp();
    });
  },

  methods: {
    initializeApp() {
      let vueObj = this;

      if (typeof window.DimWrapper === "undefined") {
        window.DimWrapper = $("#wrapper").html();
      }

      //check if ESQ page
      vueObj.currQName = $("input[name='I.SavePoint']").val();
      console.log("CurrentQ: " + vueObj.currQName);

      // check if module should be activated
      if (sessionStorage == undefined) {
        console.log("no session storage");
        vueObj.activateModule = false;
        if (vueObj.currQName == "skipped_questions") {
          window.everythingReady = function() {
            $(".mrNext").click();
          };
        }
        return false;
      }
      try {
        sessionStorage;
      } catch (err) {
        console.log("no session storage");
        vueObj.activateModule = false;
        if (vueObj.currQName == "skipped_questions") {
          window.everythingReady = function() {
            $(".mrNext").click();
          };
        }
        return false;
      }
      // if (typeof Storage == "undefined") {
      //   console.log("no session storage");
      //   vueObj.activateModule = false;
      //   if (vueObj.currQName == "skipped_questions") {
      //     window.everythingReady = function() {
      //       $(".mrNext").click();
      //     };
      //   }
      //   return false;
      // }
      let ESQq = sessionStorage.getItem("ESQ_selQ");
      if (ESQq) {
        vueObj.SelViewQ = JSON.parse(ESQq);
      }

      if (vueObj.currQName == "skipped_questions") {
        vueObj.runESQSetup();
      } else {
        //run setup for normal pages
        vueObj.runNormalSetup();
      }
    },
    UnLoadRandomData(qtFound) {
      this.LoadRandomData = false;
      if (!qtFound) {
        this.inESQ_errRandom = true;
      }
      // if (this.ActionSubmit && qtFound) {
      if (this.ActionSubmit) {
        this.navigate(".mrNext");
      }
    },
    CloseiFrame() {
      this.addIframe = false;
      this.showDevices = false;
    },
    UpdateSelDeviceBtn(selDevice) {
      this.SelDeviceBtn.lbl = selDevice.lbl;
      this.SelDeviceBtn.landSc = selDevice.landSc;
      this.SelDeviceBtn.height = selDevice.height;
      this.SelDeviceBtn.width = selDevice.width;
    },
    SetDeviceLayout(device) {
      this.addIframe = true;
      this.showDevices = false;
      this.SelDeviceBtn.width = device.width;
      this.SelDeviceBtn.height = device.height;
      this.SelDeviceBtn.lbl = device.lbl;
      this.SelDeviceBtn.landSc = device.landSc;
    },
    openDevices() {
      this.showDevices = !this.showDevices;
      setTimeout(function() {
        $("#listCont")
          .css("left", $(".actBtn:first").position().left)
          .show();
      }, 1);
    },
    runESQSetup() {
      console.log("ESQ setup");
      $("body").hide();

      //make selections
      if (Array.isArray(this.SelViewQ)) {
        let vueObj = this;

        console.log("isArray");
        // setTimeout(function() {
        window.everythingReady = function() {
          //update previewQ
          let qString = "",
            qStArr;
          $(".mrEdit").each(function() {
            qString += $(this).val() + ",";
          });

          console.log(qString);

          qStArr = qString.split(",");
          qStArr.pop();
          sessionStorage.setItem("ESQ_qString", JSON.stringify(qStArr));

          vueObj.SelViewQ.forEach(qName => {
            $(".mrEdit[value='" + qName + "']")
              .closest("tr")
              .find("input[id*='_Q1_C0']")
              .prop("checked", true);
          });

          $(".mrNext").click();
        };
      }
      //reset submited Q
      sessionStorage.setItem("ESQ_submQ", "[]");
    },
    runNormalSetup() {
      console.log("normal setup");
      let vueObj = this;
      //set seen questions

      let seenQ = sessionStorage.getItem("ESQ_toSubm");

      if (seenQ) {
        vueObj.QSeenArr = JSON.parse(seenQ);
      }

      let curQIndex = vueObj.QSeenArr.indexOf(this.currQName);
      console.log("inESQq:", this.QinESQ);
      console.log("curQIndex:", curQIndex);
      if (curQIndex == -1 && !this.QinESQ) {
        //bind events

        setTimeout(function() {
          $(".mrNext").click(function() {
            console.log("clicked");
            vueObj.QSeenArr.push(vueObj.currQName);
            sessionStorage.setItem(
              "ESQ_toSubm",
              JSON.stringify(vueObj.QSeenArr)
            );
          });
        }, 300);
      } else {
        let submitedQ = sessionStorage.getItem("ESQ_submQ");
        let submQArr;

        if (submitedQ) {
          submQArr = JSON.parse(submitedQ);
        } else {
          submQArr = [];
        }

        let inSubmQ = submQArr.indexOf(this.currQName) > -1;

        console.log("inSubmQ:", inSubmQ);

        if (inSubmQ) {
          // remove from seen
          vueObj.QSeenArr.splice(curQIndex, 1);
          sessionStorage.setItem("ESQ_toSubm", JSON.stringify(vueObj.QSeenArr));
        } else if (!this.QinESQ) {
          submQArr.push(this.currQName);

          sessionStorage.setItem("ESQ_submQ", JSON.stringify(submQArr));
          window.everythingReady = function() {
            console.log("Do submit");
            $(".mrNext").click();
          };
          return false;
        }
      }

      this.activateModule = true;
      let qString = this.getStorage("ESQ_qString");
      //qString ='["T_Q4","T_Q1","T_Q2","SAQwPictureZoom","SAQExpandable","SAQwClickImagesWOB","SAQwVolumeControlwFontSize","SAQwButtons","MACategoricalButtons","OEQwPrePostLabe","GOEQNumericRowColumnSum","SliderQHorizontal","SliderCloseness","SVGSlider"]';
      if (qString) {
        this.ViewQuestions = JSON.parse(qString);
      } else {
        this.actionBtns[1].cls = "hide";
        console.log("ESQ_qString not found");
      }
      if ($(".mrGoto").length == 0) {
        this.actionBtns[1].cls = "hide";
        console.log("GoTo button not found");
      }
      let SelQstring = sessionStorage.getItem("ESQ_selQ");
      if (SelQstring) {
        this.SelViewQ = JSON.parse(SelQstring);
      }
      // this.ViewQuestions.sort();
      this.showDrawer = this.getStorage("ESQ_showDrawer") == "true";
      var isCtrl; //,isAlt , isSft;

      // action on key up
      $(document).keyup(function(e) {
        // if (e.which == 18) {
        //   isAlt = false;
        // }
        if (e.which == 17) {
          isCtrl = false;
        }
        // if (e.which == 16) {
        //   isSft = false;
        // }
      });
      $(document).keydown(function(e) {
        // if (e.which == 18) {
        //   isAlt = true;
        // }
        if (e.which == 17) {
          isCtrl = true;
        }
        // if (e.which == 16) {
        //   isSft = true;
        // }
        //[B]hide buttons [Ctrl+Shift+B]
        // if (e.which == 66 && isSft && isCtrl) {
        //   e.preventDefault();
        //   vueObj.showHideButtons();
        // }

        //[S]how precodes [Ctrl+S]
        if (isCtrl && e.which == 83) {
          e.preventDefault();
          vueObj.DoBtnAction("codes");
          // vueObj.showCodes();
        }

        //[R]andom data [Ctrl+R]
        if (e.which == 82 && isCtrl) {
          e.preventDefault();
          vueObj.DoBtnAction("randomData");
        }

        //[Z]next question (page submit) [Ctrl+W]
        if (e.which == 90 && isCtrl) {
          e.preventDefault();
          vueObj.DoBtnAction("navNext");
        }
        //[Q]question preview [Ctrl+Q]
        if (e.which == 81 && isCtrl) {
          e.preventDefault();
          vueObj.DoBtnAction("preview");
        }

        //[E]question preview [Ctrl+E]
        if (e.which == 69 && isCtrl) {
          e.preventDefault();
          vueObj.DoBtnAction("openDevices");
        }
      });
    },
    GotoPreviewQ() {
      this.updateStorage("ESQ_selQ", JSON.stringify(this.SelViewQ));
      $(".mrGotoDropdown").val("skipped_questions");
      $(".mrGoto").click();
    },
    AddQ(Qname) {
      let index = this.SelViewQ.indexOf(Qname);

      if (index > -1) {
        this.SelViewQ.splice(index, 1);
      } else {
        this.SelViewQ.push(Qname);
      }
      sessionStorage.setItem("ESQ_selQ", JSON.stringify(this.SelViewQ));
    },
    closeModal() {
      this.showModal = false;
    },
    openInfoPopup() {
      this.ModalContent = 2;
      this.showModal = true;
      //   var shortcutsPopupInfo = "<div class='shortcutsPopupInfo'>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>G</b> </b> &#x2192; <b class='iKey'></b>Go to Question Preview<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>S</b> </b> &#x2192; <b class='iKey'></b>Show/hide precodes<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>D</b> </b> &#x2192; <b class='iKey'></b>Next page (page submit)<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>B</b> </b> &#x2192; <b class='iKey'></b>Back - Previous page<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>R</b> </b> &#x2192; <b class='iKey'></b>Random data<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>A</b> </b> &#x2192; <b class='iKey'></b>Auto answer (page submit)<br/>";
      //   shortcutsPopupInfo +=
      //     "<b><b>Ctrl</b> + <b>Shift</b> + <b>B</b> </b> &#x2192; <b class='iKey'>Show/hide buttons(Only Desktop)<br/>";
      //   shortcutsPopupInfo += "</div>";

      //   var _shortcutsInfoPopup = new OverlayMaster({
      //     Message: shortcutsPopupInfo,
      //     ModalType: "info",
      //     OkButton: "<b>&#x2715;</b>"
      //   });
      //   $(".shortcutsPopupInfo")
      //     .closest(".iisSharky-modalWindow")
      //     .addClass("popupCUSTOMlook");
      //   $(".modal-body").css("max-height", window.innerHeight - 160 + "px");
      //   shortcutsInfoPopup.show();
    },
    slideClick() {
      this.showDrawer = !this.showDrawer;
      this.slideBtnIndx = this.showDrawer ? 1 : 0;
      this.updateStorage("ESQ_showDrawer", this.showDrawer);
    },

    DoBtnAction(act) {
      this.LoadRandomData = false;
      switch (act) {
        case "preview":
          this.previewQ();
          break;
        case "codes":
          this.showCodes();
          break;
        case "randomData":
          this.setRandomData(false);
          break;
        case "navNext":
          this.setRandomData(true);
          break;

        case "openInfo":
          this.openInfoPopup();
          break;
        case "openDevices":
          this.openDevices();
          break;
      }
    },
    showHideButtons() {
      this.showBtns = !this.showBtns;
    },
    previewQ() {
      this.ModalContent = 1;
      this.showModal = true;
    },
    showCodes() {
      if (this.CodesAreShowed) {
        // show codes
        if ($(".inputPrecode").length == 0) {
          $(".question-controls-container input").each(function() {
            if (
              $(this).hasClass("mrSingle") ||
              $(this).hasClass("mrMultiple")
            ) {
              $(this).before(
                '<div class="inputPrecode">' +
                  $(this)
                    .val()
                    .replace("__", "_") +
                  "</div>"
              );
            }
          });
        } else {
          $(".inputPrecode").show();
        }
      } else {
        // hide codes
        if ($(".inputPrecode").length > 0) {
          $(".inputPrecode").hide();
        }
      }
      this.CodesAreShowed = !this.CodesAreShowed;
    },
    setRandomData(submPage) {
      this.ActionSubmit = submPage;
      this.LoadRandomData = true;
    },
    navigate(to) {
      console.log("nav", to);
      $(to).click();
    },
    updateStorage(key, val) {
      if (sessionStorage == undefined) {
        return null;
      } else {
        sessionStorage.setItem(key, val);
      }
    },
    getStorage(key) {
      if (sessionStorage == undefined) {
        return null;
      } else {
        return sessionStorage.getItem(key);
      }
    }
  },
  computed: {
    filViewQuestions() {
      let matchString = this.ViewQFilter.toLowerCase();
      if (matchString != "") {
        return this.ViewQuestions.filter(itm => {
          return itm.toLowerCase().includes(matchString);
        });
      } else {
        return this.ViewQuestions;
      }
    }
  }
};
</script>
<style>
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
#ESQPreview {
  width: 100%;
  display: flex;
  justify-content: center;
}
#PrevText {
  z-index: 9999;
  background: #6572ba;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  color: white;
  margin-bottom: 5px;
}
#PrevText > i {
  color: white;
  font-size: 18px;
  margin: 0 5px;
  font-weight: bold;
  float: left;
  transform: rotate(180deg);
}
#ESQPrevErr {
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.popupCUSTOMlook {
  user-select: none;
}
.popupCUSTOMlook .modal-content {
  border: 2px solid rgb(183, 178, 178) !important;
}
.popupCUSTOMlook .modal-body {
  overflow-y: auto !important;
}
.popupCUSTOMlook .modalContents {
  top: 45% !important;
}
.popupCUSTOMlook .btn-default {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  background-color: transparent !important;
  border-color: transparent !important;
  color: #db6060 !important;
  display: block;
}
.popupCUSTOMlook .modal-header {
  display: none !important;
}
.popupCUSTOMlook .modal-footer {
  padding: 0 !important;
  border-top: transparent !important;
  margin-top: 0 !important;
}

.shortcuts {
  width: 32px;
  height: 32px;
  float: right;
  cursor: pointer;
  padding-top: 8px;
  margin-left: 4px;
  margin-right: 2px;
}
.shortcuts svg path {
  fill: #999;
}
.shortcutsPopupInfo {
  line-height: 25px;
}
.shortcutsPopupInfo b b {
  color: #ffffff;
  background-color: #555;
  padding-left: 10px;
  padding-right: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  line-height: 35px;
  border-radius: 3px;
}

.inputPrecode {
  background-color: #434e59;
  display: inline;
  font-size: 100%;
  font-weight: bold;
  color: #7dc3e7;
  padding-left: 5px;
  padding-right: 5px;
  margin-right: 3px;
  border-radius: 2px;
}

.buttons {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 9px;
  font-size: bold;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  background-color: #49bfbc;
  border-color: #42bcb9;
  border-radius: 5px;
}
.buttons:hover {
  background-color: #3eb0ae;
}

.showKeys {
  display: inline-block;
}

.hidebuttons {
  display: none;
}
@media only screen and (max-width: 600px) {
  .showKeys {
    display: none;
  }
  .showbuttons {
    display: none;
  }
  .hidebuttons {
    display: none;
  }
}
</style>
<style scoped>
.clickable {
  cursor: pointer;
}
#drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  text-align: center;
  z-index: 99999;
}
#slideBtn {
  background: #3f56af;
  width: 100px;
  /* margin: 0 auto; */
  float: right;
  border-radius: 5px 5px 0px 0px;
  color: white;
  padding: 5px;
  opacity: 0.8;
  font-size: 18px;
  margin-right: 5px;
  position: absolute;
  top: -35px;
  right: -2px;
}
#fakeContent {
  width: 100%;
  height: 5px;
  background: rgba(64, 53, 47, 0.61);
  float: right;
}
#drawerContent {
  width: 100%;
  height: 80px;
  background: rgba(64, 53, 47, 0.61);
  color: #cccccc;

  display: flex;
  align-items: center;
  justify-content: center;
}
.slideDown {
  /* max-height: 5px;
  transition: max-height 0.25s ease-out; */
  display: none !important;
}
.slideUP {
  max-height: 500px !important;
  transition: max-height 0.35s ease-in;
}
.actBtn {
  cursor: pointer;
  background: #2e4088;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  border: solid 2px #273363;
  opacity: 0.7;
}
/* .actBtn > i {
  color: #06f3ed;
} */
.mockActBtn {
  background: #2e4088;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  border: solid 2px #273363;
  width: 35px;
  display: block;
  text-align: center;
}
.mockActBtn > i {
  color: #06f3ed;
}
th,
td {
  text-align: left;
  padding: 8px;
}
#TblAnswCont {
  width: 100%;
}
#TblAnswCont > tr:nth-child(even) {
  background-color: #f2f2f2;
}
#slideBtn:hover {
  border-top: solid 2px #7b91e6;
  border-left: solid 2px #7b91e6;
  border-right: solid 2px #7b91e6;
  opacity: 1;
}
.actBtn:hover {
  border: solid 2px #7b91e6;
  opacity: 1;
}
.bntLabel {
  margin-left: 3px;
}
#helpBtn {
  /* align-self: flex-start; */
  color: yellow;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
}

#vueModBackCont {
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.7490196078431373);
  position: fixed;
  z-index: 9999999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
#vueModHeader {
  display: flex;
  align-items: flex-end;
  flex-flow: column;
}
#vueModMainCont {
  position: absolute;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 90%;
  width: 80%;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #dadada;
  border-radius: 0.25em;
  padding: 1em;
  box-shadow: 0 0 75px rgba(0, 0, 0, 0.35);
  background-color: #fff;
  z-index: 100001;
  margin-right: auto;
  margin-left: auto;
  padding-left: 3px;
  padding-right: 3px;
  min-width: 300px;
}
#QBtnCont {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  background: lightsteelblue;
}
#instr {
  font-size: large;
  margin-top: 25px;
  font-weight: bold;
  width: 75%;
  margin-bottom: 15px;
}
#CtrlCont {
  padding: 5px;
  font-size: large;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 5px;
  background: #e4f1f0;
  padding: 5px;
}
#CtrlCont > input {
  margin-left: 5px;
}
#clearField {
  margin-left: 5px;
  cursor: pointer;
  color: #dc1616;
}
.SortCont {
  margin: 0 10px;
  cursor: pointer;
}
.SortCont:hover {
  color: #428bca;
}
.activeSort {
  color: #167fdb;
}
#vueModContent {
  display: flex;
  flex-direction: column;
  height: 88%;
}
#vueModFooter {
  display: flex;
  justify-content: center;
}

#PrevBtn {
  cursor: pointer;
  background: #428bca;
  padding: 8px;
  border: solid 1px black;
  border-radius: 5px;
  color: white;
  font-size: large;
}
#PrevBtn:hover {
  background: #3774a9;
}
.qContainer {
  margin: 5px;
  background: #eff9f9;
  border: solid 1px #136767;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  color: black;
  font-size: large;
}
.selectedQ {
  background: #38908d;
  color: white;
}
.close-button {
  /* display: block;
  width: 40px;
  height: 40px;
  z-index: 10000; */
  margin-right: 5px;
  cursor: pointer;
}
.close-button i {
  top: 0px !important;
  padding-top: unset !important;
  font-size: 30px;
  color: #666 !important;
}
#listCont {
  background: white;
  bottom: 61px;
  color: black;
  position: fixed;
  display: none;
  border-radius: 5px;
}
.deviceItm {
  /* background: lightblue; */
  padding: 5px;
  cursor: pointer;
  text-align: left;
  border-bottom: solid 1px white;
  border-radius: 5px;
}
.deviceItm:hover {
  background: lightseagreen;
}

.devList {
  margin-left: 5px;
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
  background: #bfeceb;
}
#RandomDErr {
  animation: blink 1s linear 3;
}
.functRow {
  margin: 10px 0;
}
.makeSmall {
  width: 50vw !important;
}
/* mobile look */
@media only screen and (max-width: 768px) {
  .makeSmall {
    width: 90vw !important;
  }
  #vueModMainCont {
    padding: 2px;
  }
  #instr {
    margin: 0px;
    width: 95%;
  }
  #vueModContent {
    height: 85%;
  }
  .bntLabel {
    display: none;
  }
  .hideSmall,
  #listCont {
    display: none !important;
  }
}
@media only screen and (max-height: 400px) {
  #instr {
    margin: 0px;
    width: 95%;
  }
  #vueModMainCont {
    padding: 2px;
  }
  #vueModContent {
    height: 75%;
  }
}
.icnCont {
  color: #06f3ed;
  padding: 3px;
}
</style>