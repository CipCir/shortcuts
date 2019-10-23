var scriptsArr = [
  "https://media.ipsosinteractive.com/applications/SurveyShortcuts/js/chunk-vendors.js",
  "https://media.ipsosinteractive.com/applications/SurveyShortcuts/js/app.js"
];
var stylesArr = [
  "https://media.ipsosinteractive.com/applications/SurveyShortcuts/css/chunk-vendors.css",
  "https://media.ipsosinteractive.com/applications/SurveyShortcuts/css/app.css",
  "https://media.ipsosinteractive.com/deploy/resources/FontAwesome/5.10.2/css/all.css"
];
// $(function() {
//   $("body").append("<div id='ShortApp'></div>");
stylesArr.forEach(function elm(itm) {
  $("head").append(
    "<link href='" + itm + "'  rel='stylesheet' type='text/css'/>"
  );
});

scriptsArr.forEach(function elm(itm) {
  $("head").append(
    "<script type='text/javascript' src='" + itm + "' ></script>"
  );
});
// });
