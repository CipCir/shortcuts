<template></template>
<script>
import { SSL_OP_SINGLE_DH_USE } from "constants";
export default {
  name: "RandomData",
  data() {
    return {};
  },
  created() {
    this.setRandomData();
  },
  methods: {
    setRandomData() {
      let qTypeFound = false;

      $(".question-container").removeClass("questionReadyForSubmit");
      if ($(".question-container").length > 0) {
        $(".question-container").each(function(qIndex) {
          if (
            ($(this).find("input[disabled]").length != 0 ||
              $(this).find("input").length == 0) &&
            ($(this).find("select[disabled]").length != 0 ||
              $(this).find("select").length == 0) &&
            ($(this).find("textarea[disabled]").length != 0 ||
              $(this).find("textarea").length == 0)
          ) {
            //Populate with answers only if not Read-only and if not INFO
            //AutoAnswer(".question-container");
          } else {
            //Single Answer
            if ($(this).hasClass("QType-SA")) {
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
                  //   $(this)
                  //     .find(".label-with-mrMultiple:eq(" + clickOption + ")")
                  //     .click();
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
              qTypeFound = true;
              //SLIDER OE
              if ($(this).hasClass("Slider")) {
                $(this)
                  .find(".mrEdit")
                  .val("");

                var parsedJSON = JSON.parse(
                  $(".customJSONproperties")
                    .eq(qIndex)
                    .text()
                );
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
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
              qTypeFound = true;
              //get the MaxRank
              var parsedJSON = JSON.parse(
                $(".customJSONproperties")
                  .eq(qIndex)
                  .text()
              );
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
            //not found
            if (!qTypeFound) {
              //   $(this).addClass("questionReadyForSubmit");
              $(".invisible").removeClass("invisible");
              $(".actBtn")
                .eq(3)
                .hide();
              $(".actBtn")
                .eq(4)
                .hide();

              //   single

              //   ma
              //   oe
              //   dropdown
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
        });
      }
      //after all
      this.$emit("unsetRandomData", qTypeFound);
    }
  }
};
</script>