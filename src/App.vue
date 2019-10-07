<template>
  <div id="app" v-if="activateModule">
    <div id="drawer">
      <div id="slideBtn" class="clickable" @click="slideClick()" v-html="slideBtns[slideBtnIndx]"></div>
      <div id="fakeContent" v-if="!showDrawer"></div>
      <div id="drawerContent" :class="showDrawer?'slideUP':'slideDown'">
        <div id="listCont" v-if="showDevices">
          <div
            class="deviceItm"
            :class="{'selDevice':device.lbl==SelDeviceBtn.lbl}"
            v-for="(device,index) in deviceBtns"
            :key="index"
            @click="SetDeviceLayout(device)"
          >
            <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
            <span class="devList">{{device.lbl}}</span>
          </div>
        </div>
        <div id="deviceBtn" class="actBtn" @click="openDevices()">
          <i class="fas fa-chalkboard-teacher"></i>
          <span class="bntLabel">device</span>
        </div>
        <div
          v-for="(btn,indx) in actionBtns"
          :key="indx"
          class="actBtn"
          @click="DoBtnAction(btn.action)"
        >
          <i :class="btn.icon"></i>
          <span class="bntLabel">{{btn.lbl}}</span>
        </div>
        <div id="helpBtn" @click="DoBtnAction('openInfo')">
          <i class="fas fa-info-circle"></i>
        </div>
      </div>
    </div>
    <div v-if="addIframe">
      <div id="iframeContainer" @click.self="addIframe=false">
        <div id="FrameDimControls">
          <!-- <input type="text" id="iWidht"  /> -->
          <div
            class="deviceItmFrame"
            :class="{'selDevice':device.lbl==SelDeviceBtn.lbl}"
            v-for="(device,index) in deviceBtns"
            :key="index"
            @click="SetDeviceLayout(device)"
          >
            <i :class="[device.icon,{'landSk':device.landSc},device.color]"></i>
          </div>
          <div class="ctrlZone">
            <span>Width:</span>
            <input type="range" class="FrameSlider" v-model="iFrame_Width" min="400" max="1024" />
            {{iFrame_Width}}
            <span class="dimLbl">px</span>
          </div>
          <div class="ctrlZone">
            <span>Height:</span>
            <input type="range" class="FrameSlider" v-model="iFrame_Height" min="400" max="1024" />
            {{iFrame_Height}}
            <span class="dimLbl">px</span>
          </div>
        </div>
        <iframe
          src="https://media.ipsosinteractive.com/applications/SurveyShortcuts/FishTemplate.html"
          frameborder="0"
          id="ESQFrame"
          :style="'overflow:hidden;height:' + iFrame_Height +'px;width:' + iFrame_Width+'px;'"
        />
        <div id="CloseFrame" @click="addIframe=false">
          <i class="far fa-window-close"></i>
        </div>
      </div>
    </div>

    <div v-if="showModal" id="vueModBackCont" @click.self="closeModal()">
      <div id="vueModMainCont">
        <div id="vueModHeader">
          <span class="close-button">
            <i class="fa fa-times-circle float-right" aria-hidden="true" @click="closeModal()"></i>
          </span>
        </div>
        <div id="vueModContent">
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
        <div id="vueModFooter">
          <div id="PrevBtn" @click="GotoPreviewQ()">Preview questions</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debuglog } from "util";
export default {
  name: "app",
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      activateModule: false,
      addIframe: false,
      iFrame_Width: 411,
      iFrame_Height: 731,
      showDrawer: false,
      showBtns: false,
      showModal: false,
      slideBtnIndx: 0,
      showDevices: false,
      slideBtns: [
        '<i class="far fa-caret-square-up"></i>',
        '<i class="far fa-caret-square-down"></i>'
      ],
      actionBtns: [
        // {
        //   lbl: "Previous page",
        //   icon: "fas fa-step-backward",
        //   action: "navPrev"
        // },
        { lbl: "Question preview", icon: "far fa-eye", action: "preview" },
        { lbl: "Show/hide precodes", icon: "fas fa-code", action: "codes" },
        { lbl: "Random data", icon: "fas fa-random", action: "randomData" },
        { lbl: "Next page", icon: "fas fa-step-forward", action: "navNext" }
      ],
      deviceBtns: [
        {
          lbl: "Mobile Portrait",
          icon: "fas fa-mobile-alt",
          action: "mobPortrait",
          color: "MobCol",
          width: 360,
          height: 640
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
          width: 768,
          height: 1024
        },
        {
          lbl: "Tablet Landscape",
          icon: "fas fa-tablet-alt",
          action: "TabLandscape",
          color: "TablCol",
          landSc: true,
          width: 1024,
          height: 768
        }
        // {
        //   lbl: "Desktop",
        //   icon: "fas fa-desktop",
        //   color: "DeskCol",
        //   action: "mobPortrait"
        // }
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
      curQIndex: null
    };
  },
  created() {
    window.DimWrapper = $("#wrapper").clone();
  },
  mounted() {
    //check if ESQ page
    this.currQName = $("input[name='I.SavePoint']").val();

    // check if module should be activated
    if (sessionStorage == undefined) {
      console.log("no session storage");
      this.activateModule = false;
      if (this.currQName == "skipped_questions") {
        window.everythingReady = function() {
          $(".mrNext").click();
        };
      }
      return false;
    }
    let ESQq = sessionStorage.getItem("ESQ_selQ");
    if (ESQq) {
      this.SelViewQ = JSON.parse(ESQq);
    }

    if (this.currQName == "skipped_questions") {
      this.runESQSetup();
    } else {
      //run setup for normal pages
      this.runNormalSetup();
    }
  },
  methods: {
    SetFrameDim(device) {
      this.iFrame_Width = device.width;
      this.iFrame_Height = device.height;
      this.SelDeviceBtn = device;
    },
    SetDeviceLayout(device) {
      this.addIframe = true;
      this.showDevices = false;
      this.iFrame_Width = device.width;
      this.iFrame_Height = device.height;
      this.SelDeviceBtn = device;
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

      //make selections
      if (Array.isArray(this.SelViewQ)) {
        let vueObj = this;

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
          // $("body").trigger("fakeReady");
          $(".mrNext").click();
        };
        // }, 10);
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

      let inESQq = false;
      inESQq = this.SelViewQ.indexOf(this.currQName) > -1;

      let curQIndex = vueObj.QSeenArr.indexOf(this.currQName);
      console.log("inESQq:", inESQq);
      console.log("curQIndex:", curQIndex);
      if (curQIndex == -1 && !inESQq) {
        // $("#mrForm").submit(function() {
        //   vueObj.QSeenArr.push(this.currQName);
        //   sessionStorage.setItem("ESQ_toSubm", JSON.stringify(vueObj.QSeenArr));
        // });
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
        } else if (!inESQq) {
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
      qString =
        '["T_Q4","T_Q1","T_Q2","SAQwPictureZoom","SAQExpandable","SAQwClickImagesWOB","SAQwVolumeControlwFontSize","SAQwButtons","MACategoricalButtons","OEQwPrePostLabe","GOEQNumericRowColumnSum","SliderQHorizontal","SliderCloseness","SVGSlider"]';
      if (qString) {
        this.ViewQuestions = JSON.parse(qString);
      }
      let SelQstring = sessionStorage.getItem("ESQ_selQ");
      if (SelQstring) {
        this.SelViewQ = JSON.parse(SelQstring);
      }
      // this.ViewQuestions.sort();
      this.showDrawer = this.getStorage("ESQ_showDrawer") == "true";
      var isAlt, isCtrl, isSft;
      // move app div after panel
      $(document).ready(function() {
        $("#app").insertAfter(".panel");
      });
      // action on key up
      $(document).keyup(function(e) {
        if (e.which == 18) {
          isAlt = false;
        }
        if (e.which == 17) {
          isCtrl = false;
        }
        if (e.which == 16) {
          isSft = false;
        }
      });
      $(document).keydown(function(e) {
        if (e.which == 18) {
          isAlt = true;
        }
        if (e.which == 17) {
          isCtrl = true;
        }
        if (e.which == 16) {
          isSft = true;
        }
        //[S]how precodes [Ctrl+S]
        if (isCtrl && e.which == 83) {
          e.preventDefault();
          vueObj.showCodes();
        }
        //[R]andom data [Ctrl+R]
        if (e.which == 82 && isCtrl) {
          e.preventDefault();
          vueObj.setRandomData();
        }
        //[B]hide buttons [Ctrl+Shift+B]
        if (e.which == 66 && isSft && isCtrl) {
          e.preventDefault();
          vueObj.showHideButtons();
        }
        //[D]ext question (page submit) [Ctrl+D]
        if (e.which == 68 && isCtrl) {
          e.preventDefault();
          vueObj.navigate(".mrNext");
        }
        //[P]revious question [Ctrl+B]
        if (e.which == 66 && isCtrl && !isSft) {
          e.preventDefault();
          vueObj.navigate(".mrPrev");
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
      var shortcutsPopupInfo = "<div class='shortcutsPopupInfo'>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>G</b> </b> &#x2192; <b class='iKey'></b>Go to Question Preview<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>S</b> </b> &#x2192; <b class='iKey'></b>Show/hide precodes<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>D</b> </b> &#x2192; <b class='iKey'></b>Next page (page submit)<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>B</b> </b> &#x2192; <b class='iKey'></b>Back - Previous page<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>R</b> </b> &#x2192; <b class='iKey'></b>Random data<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>A</b> </b> &#x2192; <b class='iKey'></b>Auto answer (page submit)<br/>";
      shortcutsPopupInfo +=
        "<b><b>Ctrl</b> + <b>Shift</b> + <b>B</b> </b> &#x2192; <b class='iKey'>Show/hide buttons(Only Desktop)<br/>";
      shortcutsPopupInfo += "</div>";

      var _shortcutsInfoPopup = new OverlayMaster({
        Message: shortcutsPopupInfo,
        ModalType: "info",
        OkButton: "<b>&#x2715;</b>"
      });
      $(".shortcutsPopupInfo")
        .closest(".iisSharky-modalWindow")
        .addClass("popupCUSTOMlook");
      $(".modal-body").css("max-height", window.innerHeight - 160 + "px");
      _shortcutsInfoPopup.show();
    },
    slideClick() {
      this.showDrawer = !this.showDrawer;
      this.slideBtnIndx = this.showDrawer ? 1 : 0;
      this.updateStorage("ESQ_showDrawer", this.showDrawer);
    },
    ShowESQModal() {},
    DoBtnAction(act) {
      switch (act) {
        case "preview":
          this.previewQ();
          break;
        case "codes":
          this.showCodes();
          break;
        case "randomData":
          this.setRandomData();
          break;
        case "navNext":
          this.setRandomData();
          this.navigate(".mrNext");
          break;
        case "navPrev":
          this.navigate(".mrPrev");
          break;
        case "openInfo":
          this.openInfoPopup();
          break;
      }
    },
    showHideButtons() {
      this.showBtns = !this.showBtns;
    },
    previewQ() {
      this.showModal = true;
    },
    showCodes() {
      if (this.CodesAreShowed) {
        // show codes
        if ($(".inputPrecode").length == 0) {
          $(".question-controls-container input").each(function() {
            debugger;
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
    setRandomData() {
      $(".question-container").removeClass("questionReadyForSubmit");
      if ($(".question-container").length > 0) {
        $(".question-container").each(function() {
          if (
            ($(this).find("input[disabled]").length != 0 ||
              $(this).find("input").length == 0) &&
            ($(this).find("select[disabled]").length != 0 ||
              $(this).find("select").length == 0) &&
            ($(this).find("textarea[disabled]").length != 0 ||
              $(this).find("textarea").length == 0)
          ) {
            //Populate with answers only if not Read-only and if not INFO
            $(this).addClass("questionReadyForSubmit");
            //AutoAnswer(".question-container");
          } else {
            //Single Answer
            if ($(this).hasClass("QType-SA")) {
              if ($(this).hasClass("Slider")) {
                //Slider
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(
                  Math.random() * availableOptions + 1
                );
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .prop("checked", true);
                $(this)
                  .find(".slider")
                  .slider("value", randomOption);
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("CategoricalButtons")) {
                //Categorical Buttons
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(Math.random() * availableOptions);
                $(this)
                  .find(".answer-container:eq(" + randomOption + ")")
                  .click();
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .prop("checked", true);
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("CategoricalVolumeControl")) {
                //VolumeControl
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(Math.random() * availableOptions);
                $(this)
                  .find(".VC_bar:eq(" + randomOption + ")")
                  .click();
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .prop("checked", true);
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("CategoricalClickImages")) {
                //SA CategoricalClickImages
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(Math.random() * availableOptions);
                $(this)
                  .find(".mrSingleText:eq(" + randomOption + ")")
                  .click();
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .prop("checked", true);
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("Categorical")) {
                //Expandable SA Categorical
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                $(this)
                  .find(".mrSingle")
                  .closest("label")
                  .removeClass("cellCheckedBackground");
                $(this)
                  .find(".header")
                  .removeClass("showMe");
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(Math.random() * availableOptions);
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .closest(".subList")
                  .prev(".header")
                  .addClass("showMe");
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .prop("checked", true);
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .closest("label")
                  .addClass("cellCheckedBackground");
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else {
                $(this)
                  .find(".mrSingle")
                  .prop("checked", false);
                $(this)
                  .find(".mrSingle")
                  .closest("label")
                  .removeClass("cellCheckedBackground");
                $(this)
                  .find(".mrEdit")
                  .val("");
                var availableOptions = $(this).find(".mrSingle").length;
                var randomOption = Math.floor(Math.random() * availableOptions);
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .click();
                $(this)
                  .find(".mrSingle:eq(" + randomOption + ")")
                  .closest("label")
                  .addClass("cellCheckedBackground");
                //if Other(Specify)
                if (
                  $(this)
                    .find(".mrSingle:eq(" + randomOption + ")")
                    .closest(".answer-container")
                    .find(".mrEdit").length > 0
                ) {
                  if (
                    $(this)
                      .find(".mrSingle:eq(" + randomOption + ")")
                      .closest(".answer-container")
                      .find(".mrSingleText")
                      .text().length == 0
                  ) {
                    $(this)
                      .find(".mrSingle:eq(" + randomOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit")
                      .val(
                        $(".question-container .mrQuestionText:eq(0)")
                          .text()
                          .slice(
                            0,
                            $(this)
                              .find(".mrSingle:eq(" + randomOption + ")")
                              .closest(".answer-container")
                              .find(".mrEdit")
                              .attr("maxlength")
                          )
                      )
                      .trigger("blur");
                  } else {
                    $(this)
                      .find(".mrSingle:eq(" + randomOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit")
                      .val(
                        $(this)
                          .find(".mrSingle:eq(" + randomOption + ")")
                          .closest(".answer-container")
                          .find(".mrSingleText")
                          .text()
                          .slice(
                            0,
                            $(this)
                              .find(".mrSingle:eq(" + randomOption + ")")
                              .closest(".answer-container")
                              .find(".mrEdit")
                              .attr("maxlength")
                          )
                      )
                      .trigger("blur");
                  }
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              }
            }
            //SP DropDown
            if ($(this).hasClass("QType-DROPDOWN")) {
              var availableOptions = $(this).find("select option").length;
              var randomOption = Math.floor(Math.random() * availableOptions);
              if (randomOption == 0) {
                randomOption = 1;
              }
              $(this)
                .find("select option:eq(" + randomOption + ")")
                .prop("selected", true);
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
            }
            //GRID SP DropDown
            if (
              $(this).hasClass("QType-GRID") &&
              $(this).hasClass("QSubType-DROPDOWN")
            ) {
              var availableOptions = $(this).find("select:first option").length;
              var randomOption = 0;
              $(this)
                .find("select")
                .each(function() {
                  randomOption = Math.floor(Math.random() * availableOptions);
                  if (randomOption == 0) {
                    randomOption = 1;
                  }
                  $(this)
                    .find("option:eq(" + randomOption + ")")
                    .prop("selected", true);
                });
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
            }
            //Multiple Answers
            if ($(this).hasClass("QType-MA")) {
              if ($(this).hasClass("CategoricalClickImages")) {
                //MA Click Images
                $(this)
                  .find(".mrMultiple")
                  .prop("checked", false);
                var availableOptions = $(this).find(".mrMultiple").length;
                var howManyOptions = Math.floor(
                  Math.random() * availableOptions + 1
                );
                var clickOption;
                for (var i = 0; i < howManyOptions; i++) {
                  var clickOption = Math.floor(
                    Math.random() * availableOptions
                  );
                  if (
                    $(this).find(".answerInside:eq(" + clickOption + ")")
                      .length > 0
                  ) {
                    $(this)
                      .find(".answerInside:eq(" + clickOption + ")")
                      .click();
                  } else {
                    $(this)
                      .find(".mrMultiple:eq(" + clickOption + ")")
                      .click();
                  }
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("Categorical")) {
                //Expandable MA Categorical
                $(this)
                  .find(".mrMultiple")
                  .prop("checked", false);
                $(this)
                  .find(".mrMultiple")
                  .closest("label")
                  .removeClass("cellCheckedBackground");
                var availableOptions = $(this).find(".mrMultiple").length;
                var howManyOptions = Math.floor(
                  Math.random() * availableOptions + 1
                );
                var clickOption;
                for (var i = 0; i < howManyOptions; i++) {
                  $(this)
                    .find(".mrMultiple")
                    .closest("label")
                    .removeClass("cellCheckedBackground");
                  $(this)
                    .find(".subList")
                    .prev(".header")
                    .removeClass("showMe");
                  var clickOption = Math.floor(
                    Math.random() * availableOptions
                  );
                  $(this)
                    .find(".mrMultiple:eq(" + clickOption + ")")
                    .click();
                  $(this)
                    .find(".mrMultiple:checked")
                    .closest("label")
                    .addClass("cellCheckedBackground");
                  $(this)
                    .find(".mrMultiple:checked")
                    .closest(".subList")
                    .prev(".header")
                    .addClass("showMe");
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("CategoricalButtons")) {
                $(this)
                  .find(".mrMultiple")
                  .prop("checked", false);
                $(".btn-checked").removeClass("btn-checked");
                var availableOptions = $(this).find(".mrMultiple").length;
                var howManyOptions = Math.floor(
                  Math.random() * availableOptions + 1
                );
                var clickOption;
                for (var i = 0; i < howManyOptions; i++) {
                  var clickOption = Math.floor(
                    Math.random() * availableOptions
                  );
                  clickOption = clickOption == 0 ? 0 : clickOption;
                  $(this)
                    .find(".label-with-mrMultiple:eq(" + clickOption + ")")
                    .click();

                  //if Other(Specify)
                  if (
                    $(this)
                      .find(".mrMultiple:eq(" + clickOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit").length > 0
                  ) {
                    if (
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .is(":checked")
                    ) {
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .closest(".answer-container")
                        .find(".mrEdit")
                        .val(
                          $(this)
                            .find(".mrMultiple:eq(" + clickOption + ")")
                            .closest(".answer-container")
                            .find(".mrMultipleText")
                            .text()
                            .slice(
                              0,
                              $(this)
                                .find(".mrMultiple:eq(" + clickOption + ")")
                                .closest(".answer-container")
                                .find(".mrEdit")
                                .attr("maxlength")
                            )
                        )
                        .trigger("blur");
                    } else {
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .closest(".answer-container")
                        .find(".mrEdit")
                        .val("")
                        .trigger("blur");
                    }
                  }
                }
                $(this).addClass("questionReadyForSubmit");
              } else {
                $(this)
                  .find(".mrMultiple")
                  .prop("checked", false);
                $(this)
                  .find(".mrMultiple")
                  .closest("label")
                  .removeClass("cellCheckedBackground");
                $(this)
                  .find(".mrEdit")
                  .val("");
                var availableOptions = $(this).find(".mrMultiple").length;
                var howManyOptions = Math.floor(
                  Math.random() * availableOptions + 1
                );
                var clickOption;
                for (var i = 0; i < howManyOptions; i++) {
                  var clickOption = Math.floor(
                    Math.random() * availableOptions
                  );
                  $(this)
                    .find(".mrMultiple:eq(" + clickOption + ")")
                    .click();
                  $(this)
                    .find(".label-with-mrMultiple:eq(" + clickOption + ")")
                    .click();
                  //.prop("checked", true);
                  //if Other(Specify)
                  if (
                    $(this)
                      .find(".mrMultiple:eq(" + clickOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit").length > 0
                  ) {
                    if (
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .is(":checked")
                    ) {
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .closest(".answer-container")
                        .find(".mrEdit")
                        .val(
                          $(this)
                            .find(".mrMultiple:eq(" + clickOption + ")")
                            .closest(".answer-container")
                            .find(".mrMultipleText")
                            .text()
                            .slice(
                              0,
                              $(this)
                                .find(".mrMultiple:eq(" + clickOption + ")")
                                .closest(".answer-container")
                                .find(".mrEdit")
                                .attr("maxlength")
                            )
                        )
                        .trigger("blur");
                    } else {
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .closest(".answer-container")
                        .find(".mrEdit")
                        .val("")
                        .trigger("blur");
                    }
                  }
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              }
            }
            //OE
            if ($(this).hasClass("QType-OE")) {
              //SLIDER OE
              if ($(this).hasClass("Slider")) {
                $(this)
                  .find(".mrEdit")
                  .val("");
                var parsedJSON = JSON.parse($(".customJSONproperties").text());
                var sliderMin = 1;
                var sliderMax = 10;
                if (
                  parsedJSON.SliderMin != 1 &&
                  parsedJSON.SliderMin != undefined
                ) {
                  sliderMin = parsedJSON.SliderMin;
                }
                if (
                  parsedJSON.SliderMax != 10 &&
                  parsedJSON.SliderMax != undefined
                ) {
                  sliderMax = parsedJSON.SliderMax;
                }
                var randomPunch = Math.floor(
                  Math.random() * (sliderMax - sliderMin) + sliderMin
                );
                //if slider with checkbox
                if ($(this).find(".mrMultiple").length > 0) {
                  var rNumber = Math.floor(Math.random() * 10 + 1);
                  if (rNumber < 4) {
                    $(this)
                      .find(".mrMultiple")
                      .click();
                  } else {
                    $(this)
                      .find(".slider")
                      .slider("value", randomPunch);
                  }
                } else {
                  $(this)
                    .find(".slider")
                    .slider("value", randomPunch);
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else {
                // $(this)
                //   .find(".mrEdit")
                //   .val("");
                var textLength = $(this)
                  .find(".mrQuestionText:first")
                  .text().length;
                var randomLength = Math.floor(Math.random() * textLength);
                $(this)
                  .find(".mrEdit")
                  .val(
                    $(this)
                      .find(".mrQuestionText")
                      .text()
                      .substring(1, randomLength)
                  );
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              }
            }
            //NUMERIC
            if ($(this).hasClass("QType-NUM")) {
              //SLIDER NUMERIC + CLOSENESS
              if ($(this).hasClass("Slider")) {
                $(this)
                  .find(".mrEdit")
                  .val("");
                var sliderMax = $(this).find(".slider-label-value").length;
                var randomPunch = Math.floor(Math.random() * sliderMax + 1);
                //if slider with checkbox
                if ($(this).find(".mrMultiple").length > 0) {
                  var rNumber = Math.floor(Math.random() * 10 + 1);
                  if (rNumber < 4) {
                    $(this)
                      .find(".mrMultiple")
                      .click();
                  } else {
                    $(this)
                      .find(".slider")
                      .slider("value", randomPunch);
                  }
                } else {
                  $(this)
                    .find(".slider")
                    .slider("value", randomPunch);
                }
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else {
                $(this)
                  .find(".mrEdit")
                  .val("");
                var maxLength = $(this)
                  .find(".mrEdit")
                  .attr("maxlength");
                if (maxLength > 3) {
                  maxLength = 3;
                }
                var randomNumber = Math.floor(
                  Math.random() * Math.pow(10, maxLength) - 1
                );
                $(this)
                  .find(".mrEdit")
                  .val(randomNumber);
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              }
            }
            //GRID
            if ($(this).hasClass("QType-GRID")) {
              //Sliders
              if (
                $(this).hasClass("QSubType-NUM") &&
                $(this).hasClass("Slider")
              ) {
                var sliderMax = $(this).find(
                  ".mrQuestionTable tr:first .slider-label-value"
                ).length;
                var randomOption = 0;
                $(this)
                  .find(".slider")
                  .closest("tr")
                  .each(function() {
                    randomOption = Math.floor(Math.random() * sliderMax + 1);
                    //if slider with checkbox
                    if ($(this).find(".mrMultiple").length > 0) {
                      var rNumber = Math.floor(Math.random() * 10 + 1);
                      if (rNumber < 4) {
                        $(this)
                          .find(".mrMultiple")
                          .click();
                      } else {
                        $(this)
                          .find(".slider")
                          .slider("value", randomOption);
                      }
                    } else {
                      $(this)
                        .find(".slider")
                        .slider("value", randomOption);
                    }
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if (
                $(this).hasClass("QSubType-NUM") &&
                $(this).hasClass("GridProgressive")
              ) {
                //GridProgressive with Slider
                var sliderMax = $(this).find(".Slider .slider-label-value")
                  .length;
                var randomOption = 0;
                $(this)
                  .find("tr")
                  .each(function() {
                    randomOption = Math.floor(Math.random() * sliderMax + 1);
                    if ($(this).find(".mrMultiple").length > 0) {
                      var rNumber = Math.floor(Math.random() * 10 + 1);
                      if (rNumber < 4) {
                        $(this)
                          .find(".mrMultiple")
                          .click()
                          .prop("checked", true);
                      } else {
                        $(this)
                          .find(".mrEdit")
                          .val(randomOption)
                          .change();
                      }
                    } else {
                      $(this)
                        .find(".mrEdit")
                        .val(randomOption)
                        .change();
                    }
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if (
                $(this).hasClass("QSubType-OE") &&
                $(this).hasClass("GridProgressive")
              ) {
                //GridProgressive with Closeness
                var sliderMax = $(this).find(".Slider .slider-label-value")
                  .length;
                var randomOption = 0;
                $(this)
                  .find("tr")
                  .each(function() {
                    randomOption = Math.floor(Math.random() * sliderMax + 1);
                    $(this)
                      .find(".mrEdit")
                      .val(randomOption)
                      .change();
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if (
                $(this).hasClass("QSubType-SA") &&
                $(this).hasClass("Slider")
              ) {
                //GridBipolar
                var sliderMax = $(this).find(
                  ".mrQuestionTable tr:eq(1) .mrSingle"
                ).length;
                var randomOption = 0;
                $(this)
                  .find(".slider")
                  .closest("tr")
                  .each(function() {
                    randomOption = Math.floor(Math.random() * sliderMax + 1);
                    $(this)
                      .find(".slider")
                      .slider("value", randomOption);
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("QSubType-NUM")) {
                //GridOpenEnd Numeric
                $(this)
                  .find(".mrEdit")
                  .val("");
                var maxLength = $(this)
                  .find(".mrEdit:first")
                  .attr("maxlength");
                if (maxLength > 2) {
                  maxLength = 2;
                }
                var randomNumber = 0;
                $(this)
                  .find(".mrEdit")
                  .each(function() {
                    randomNumber = Math.floor(
                      Math.random() * Math.pow(10, maxLength) - 1
                    );
                    $(this)
                      .val(randomNumber)
                      .change();
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              } else if ($(this).hasClass("QSubType-OE")) {
                //GridOpenEnd
                //var textLength = $(this).find('.mrQuestionText:first').text().length;
                var textLength = $(this)
                  .find(".mrEdit:first")
                  .attr("maxlength");
                $(this)
                  .find(".mrEdit")
                  .each(function(index) {
                    $(this).val("");
                    var randomLength = Math.floor(
                      Math.random() * textLength + 1
                    );
                    $(this).val(
                      $(".QSubType-OE")
                        .find(".mrQuestionText")
                        .text()
                        .substring(0, randomLength)
                    );
                  });
                $(this).addClass("questionReadyForSubmit");
                //AutoAnswer(".question-container");
              }
            }
            //Grid SA/ROW
            if ($(this).hasClass("QType-GRID QSubType-SA QOrientation-ROW")) {
              $(this)
                .find(".mrSingle")
                .prop("checked", false);
              $(this)
                .find(".mrSingle")
                .closest("div")
                .removeClass("cellCheckedBackground");
              $(this)
                .find(".mrEdit")
                .val("");
              var availableOptions = $(this).find(
                ".mrQuestionTable tr:eq(1) .mrSingle"
              ).length;
              var randomOption = 0;
              $(this)
                .find(".mrQuestionTable tr:not(:first)")
                .each(function() {
                  randomOption = Math.floor(Math.random() * availableOptions);
                  $(this)
                    .find(".mrSingle:eq(" + randomOption + ")")
                    .click();
                  $(this)
                    .find(".mrSingle:eq(" + randomOption + ")")
                    .closest("div")
                    .addClass("cellCheckedBackground");
                  //if Other(Specify)
                  if (
                    $(this)
                      .find(".mrSingle:eq(" + randomOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit").length > 0
                  ) {
                    $(this)
                      .find(".mrSingle:eq(" + randomOption + ")")
                      .closest(".answer-container")
                      .find(".mrEdit")
                      .val(
                        $(this)
                          .closest(".mrQuestionTable")
                          .find(
                            "tr:eq(0) td:eq(" +
                              (randomOption + 1) +
                              ") .mrQuestionText"
                          )
                          .text()
                          .slice(
                            0,
                            $(this)
                              .find(".mrSingle:eq(" + randomOption + ")")
                              .closest(".answer-container")
                              .find(".mrEdit")
                              .attr("maxlength")
                          )
                      )
                      .trigger("blur");
                  }
                });
              //if GridCollapsible
              if ($(this).hasClass("Grid")) {
                $(this)
                  .find(".GridCollapsible tr:last-child td:first-child")
                  .trigger("click");
              }
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
              //}
            }
            //Grid MA/ROW
            if ($(this).hasClass("QType-GRID QSubType-MA QOrientation-ROW")) {
              $(this)
                .find(".mrMultiple")
                .prop("checked", false);
              $(this)
                .find(".mrMultiple")
                .closest("div")
                .removeClass("cellCheckedBackground");
              $(this)
                .find(".mrEdit")
                .val("");
              var availableOptions = $(this).find(
                ".mrQuestionTable tr:eq(1) .mrMultiple"
              ).length;
              var howManyOptions = 0;
              var clickOption = 0;
              $(this)
                .find(".mrQuestionTable tr:not(:first)")
                .each(function(index) {
                  howManyOptions = Math.floor(
                    Math.random() * availableOptions + 1
                  );
                  if (howManyOptions % 2 == 0) {
                    howManyOptions = howManyOptions + 1;
                  }
                  for (var i = 0; i < howManyOptions; i++) {
                    clickOption = Math.floor(
                      Math.random() * (availableOptions - 1)
                    );
                    $(this)
                      .find(".mrMultiple:eq(" + clickOption + ")")
                      .click();
                    //if Other(Specify)
                    if (
                      $(this)
                        .find(".mrMultiple:eq(" + clickOption + ")")
                        .closest(".answer-container")
                        .find(".mrEdit").length > 0
                    ) {
                      if (
                        $(this)
                          .find(".mrMultiple:eq(" + clickOption + ")")
                          .is(":checked")
                      ) {
                        $(this)
                          .find(".mrMultiple:eq(" + clickOption + ")")
                          .closest(".answer-container")
                          .find(".mrEdit")
                          .val(
                            $(this)
                              .closest(".mrQuestionTable")
                              .find(
                                "tr:eq(0) td:eq(" +
                                  (clickOption + 1) +
                                  ") .mrQuestionText"
                              )
                              .text()
                              .slice(
                                0,
                                $(this)
                                  .find(".mrMultiple:eq(" + clickOption + ")")
                                  .closest(".answer-container")
                                  .find(".mrEdit")
                                  .attr("maxlength")
                              )
                          )
                          .trigger("blur");
                      } else {
                        $(this)
                          .find(".mrMultiple:eq(" + clickOption + ")")
                          .closest(".answer-container")
                          .find(".mrEdit")
                          .val("")
                          .trigger("blur");
                      }
                    }
                  }
                  //re-check and erase OtherSpecify if text inside but no punch
                  $(this)
                    .find(".mrEdit")
                    .each(function() {
                      if (
                        $(this).val() != "" &&
                        $(this)
                          .closest(".answer-container")
                          .find(".mrMultiple")
                          .is(":not(:checked)")
                      ) {
                        $(this).val("");
                      }
                    });
                });
              //if GridCollapsible
              if ($(this).hasClass("Grid")) {
                $(".GridCollapsible tr").each(function() {
                  //check for exclusive + other options selected at the same time
                  if ($(this).find(".exclusive-element").length > 0) {
                    if (
                      $(this).find(".mrMultiple:checked").length > 1 &&
                      $(this)
                        .find(".exclusive-element .mrMultiple")
                        .is(":checked")
                    ) {
                      $(this)
                        .find(".mrMultiple")
                        .click();
                    }
                  }
                  //check for no option selected
                  if ($(this).find(".mrMultiple:checked").length == 0) {
                    clickOption = Math.floor(Math.random() * availableOptions);
                    $(this)
                      .find(".mrMultiple:eq(" + clickOption + ")")
                      .click();
                  }
                });
                $(this)
                  .find(".GridCollapsible tr:last-child td:first-child")
                  .trigger("click");
              }
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
              //};
            }
            //Grid SA/COL
            if ($(this).hasClass("QType-GRID QSubType-SA QOrientation-COL")) {
              $(this)
                .find(".mrSingle")
                .prop("checked", false);
              $(this)
                .find(".mrSingle")
                .closest("div")
                .removeClass("cellCheckedBackground");
              $(this)
                .find(".mrEdit")
                .val("");
              var availableOptions = $(this).find(
                ".mrQuestionTable td:nth-child(2) .mrSingle"
              ).length;
              var randomOption = 0;
              $(this)
                .find(".mrQuestionTable tr:eq(0) td")
                .not(":nth-child(1)")
                .each(function(index) {
                  randomOption = Math.floor(Math.random() * availableOptions);
                  var $opt = $(this)
                    .closest(".mrQuestionTable")
                    .find(
                      "tr:eq(" +
                        (randomOption + 1) +
                        ") td:eq(" +
                        (index + 1) +
                        ") .mrSingle"
                    );
                  $opt.click();
                  $opt.closest("div").addClass("cellCheckedBackground");
                  if (
                    $opt.closest(".answer-container").find(".mrEdit").length > 0
                  ) {
                    $opt
                      .closest(".answer-container")
                      .find(".mrEdit")
                      .val(
                        $opt
                          .closest("tr")
                          .find("td:first-child .mrQuestionText")
                          .text()
                          .slice(
                            0,
                            $opt
                              .closest(".answer-container")
                              .find(".mrEdit")
                              .attr("maxlength")
                          )
                      )
                      .trigger("blur");
                  }
                });
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
            }
            //Grid MA/COL
            if ($(this).hasClass("QType-GRID QSubType-MA QOrientation-COL")) {
              $(this)
                .find(".mrMultiple")
                .prop("checked", false);
              $(this)
                .find(".mrMultiple")
                .closest("div")
                .removeClass("cellCheckedBackground");
              $(this)
                .find(".mrEdit")
                .val("");
              var availableOptions = $(this).find(
                ".mrQuestionTable td:nth-child(2) .mrMultiple"
              ).length;
              var numberOfCols =
                $(this).find(".mrQuestionTable tr:eq(0) td").length + 1;
              var randomOption = 0;
              $(this)
                .find(".mrQuestionTable tr:eq(0) td")
                .not(":nth-child(1)")
                .each(function(index) {
                  howManyOptions = Math.floor(
                    Math.random() * availableOptions + 1
                  );
                  for (var i = 0; i < howManyOptions; i++) {
                    var clickOption = Math.floor(
                      Math.random() * availableOptions
                    );
                    var $opt = $(this)
                      .closest(".mrQuestionTable")
                      .find(
                        "tr:eq(" +
                          (clickOption + 1) +
                          ") td:eq(" +
                          (index + 1) +
                          ") .mrMultiple"
                      );
                    $opt.click();
                    if ($opt.is(":checked")) {
                      $opt.closest("div").addClass("cellCheckedBackground");
                    } else {
                      $opt.closest("div").removeClass("cellCheckedBackground");
                    }
                    if (
                      $opt.closest(".answer-container").find(".mrEdit").length >
                      0
                    ) {
                      if ($opt.is(":checked")) {
                        $opt
                          .closest(".answer-container")
                          .find(".mrEdit")
                          .val(
                            $opt
                              .closest("tr")
                              .find("td:first-child .mrQuestionText")
                              .text()
                              .slice(
                                0,
                                $opt
                                  .closest(".answer-container")
                                  .find(".mrEdit")
                                  .attr("maxlength")
                              )
                          )
                          .trigger("blur");
                      } else {
                        $opt
                          .closest(".answer-container")
                          .find(".mrEdit")
                          .val("")
                          .trigger("blur");
                      }
                    }
                  }
                });
              for (var k = 2; k < numberOfCols; k++) {
                //check the first answer if no answer for that column
                if (
                  $(this).find(
                    ".mrQuestionTable td:nth-child(" +
                      k +
                      ") .mrMultiple:checked"
                  ).length == 0
                ) {
                  $(this)
                    .find(
                      ".mrQuestionTable td:nth-child(" +
                        k +
                        ") .mrMultiple:first"
                    )
                    .prop("checked", true);
                  $(this)
                    .find(
                      ".mrQuestionTable td:nth-child(" +
                        k +
                        ") .mrMultiple:first"
                    )
                    .closest("div")
                    .addClass("cellCheckedBackground");
                }
              }
              //re-check and erase OtherSpecify if text inside but no punch
              $(this)
                .find(".mrEdit")
                .each(function() {
                  if (
                    $(this).val() != "" &&
                    $(this)
                      .closest(".answer-container")
                      .find(".mrMultiple")
                      .is(":not(:checked)")
                  ) {
                    $(this).val("");
                  }
                });
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
            }
            //Bubble Ranking
            if ($(this).hasClass("BubbleRanking")) {
              //get the MaxRank
              var parsedJSON = JSON.parse($(".customJSONproperties").text());
              var NoOfRanks = $(".rankingHolder")
                .parent()
                .find(".mrEdit")
                .not(".exclusive")
                .parentsUntil("tbody")
                .find(".theRank").length;
              var availableOptions = NoOfRanks;
              var rNumber = Math.floor(Math.random() * 10 + 1);
              if (
                parsedJSON.MaxRank != 0 &&
                parsedJSON.MaxRank != NoOfRanks &&
                parsedJSON.MaxRank != undefined
              ) {
                NoOfRanks = parsedJSON.MaxRank;
              }
              //check for exclusive and punch 25% of times
              if (
                parsedJSON.ExclusiveCode != undefined &&
                parsedJSON.ExclusiveCode.length > 0 &&
                rNumber < 3
              ) {
                $(".exclusive")
                  .parentsUntil("tbody")
                  .find(".theRank")
                  .click();
              } else {
                for (var i = 0; i < NoOfRanks; i++) {
                  var clickOption = Math.floor(
                    Math.random() * (availableOptions - i)
                  );
                  $(".rankingHolder")
                    .parent()
                    .find(".mrEdit")
                    .not(".exclusive")
                    .parentsUntil("tbody")
                    .find('.theRank[data-rank=""]')
                    .eq(clickOption)
                    .click();
                }
              }
              $(this).addClass("questionReadyForSubmit");
              //AutoAnswer(".question-container");
            }
          }
        });
      } else if ($(".mrDropdown").length > 0) {
        $(".mrDropdown").each(function() {
          var availableOptions = $(this).find('option[value!=""]').length;
          var randomOption = Math.floor(Math.random() * availableOptions);
          if (randomOption == 0) {
            randomOption = 1;
          }
          $(this)
            .find("option:eq(" + randomOption + ")")
            .prop("selected", true);
          $(this).addClass("questionReadyForSubmit");
          //AutoAnswer(".mrDropdown");
        });
      }

      // function //AutoAnswer(object) {
      //   var qc_l = $(object).length;
      //   var qrfs_l = $(".questionReadyForSubmit").length;
      //   // if ((qc_l == qrfs_l) && (Auto_Answer == 1)) {
      //   //     // PageSubmit();
      //   // };
      // }
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
.showbuttons {
  display: flex !important;
  justify-content: flex-end;
}
#shortcutscontainer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.buttonsdiv {
  width: 96%;
  display: none;
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
.actBtn > i {
  color: #06f3ed;
}
#slideBtn:hover {
  border-top: solid 2px black;
  border-left: solid 2px black;
  border-right: solid 2px black;
  opacity: 1;
}
.actBtn:hover {
  border: solid 2px black;
  opacity: 1;
}
.bntLabel {
  margin-left: 3px;
}
#helpBtn {
  align-self: flex-start;
  color: yellow;
  font-size: 20px;
  cursor: pointer;
}

#vueModBackCont {
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.7490196078431373);
  position: fixed;
  z-index: 9999;
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
  justify-content: space-between;
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
  display: block;
  width: 40px;
  height: 40px;
  z-index: 10000;
  cursor: pointer;
}
.close-button i {
  top: 0px !important;
  padding-top: unset !important;
  font-size: 30px;
  color: #666 !important;
}
#listCont {
  bottom: 61px;
  color: black;
  position: fixed;
  display: none;
}
.deviceItm,
.deviceItmFrame {
  background: lightblue;
  padding: 5px;
  cursor: pointer;
  text-align: left;
  border-bottom: solid 1px white;
  border-radius: 5px;
}
.deviceItm:hover,
.deviceItmFrame:hover {
  background: lightseagreen;
}
.deviceItmFrame {
  margin: 0 3px;
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
  background: white;
}
/* mobile look */
@media only screen and (max-width: 768px) {
  .bntLabel {
    display: none;
  }
  #deviceBtn,
  #listCont {
    display: none !important;
  }
}
</style>
