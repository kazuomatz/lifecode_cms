function circlePreloader() {

  return ($(
    '<div id="preloader" style="z-index:2000">' +
    '<div class="preloader-wrapper big active">' +

    '<div class="spinner-layer spinner-blue">' +
    '<div class="circle-clipper left">' +
    '<div class="circle"></div>' +
    '</div><div class="gap-patch">' +
    '<div class="circle"></div>' +
    '</div><div class="circle-clipper right">' +
    '<div class="circle"></div>' +
    '</div>' +
    '</div>' +

    '<div class="spinner-layer spinner-red">' +
    '<div class="circle-clipper left">' +
    '<div class="circle"></div>' +
    '</div><div class="gap-patch">' +
    '<div class="circle"></div>' +
    '</div><div class="circle-clipper right">' +
    '<div class="circle"></div>' +
    '</div>' +
    '</div>' +

    '<div class="spinner-layer spinner-yellow">' +
    '<div class="circle-clipper left">' +
    '<div class="circle"></div>' +
    '</div><div class="gap-patch">' +
    '<div class="circle"></div>' +
    '</div><div class="circle-clipper right">' +
    '<div class="circle"></div>' +
    '</div>' +
    '</div>' +

    '<div class="spinner-layer spinner-green">' +
    '<div class="circle-clipper left">' +
    '<div class="circle"></div>' +
    '</div><div class="gap-patch">' +
    '<div class="circle"></div>' +
    '</div><div class="circle-clipper right">' +
    '<div class="circle"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'));
}

function showPreloader(element) {
  var html = circlePreloader();
  var wrapper = $("<div id='preloader-wrapper'></div>")
  wrapper.width($(element).width());
  wrapper.height($(element).height());
  wrapper.css({position: "absolute", top: 0, backgroundColor: "transparent", opacity: 1, z_index: 2000});
  wrapper.append(html);
  $(element).append(wrapper).ready(function () {
    var width = $("#preloader .preloader-wrapper.big").width();
    $("#preloader").css("position", "absolute").css('top', (wrapper.height() / 2 - width / 2) + "px").css('left', (wrapper.width() / 2 - width / 2) + "px");
    //$(element).append(html).ready(function(){
    //$("#preloader").css('top',($(element).height()/2 - $("#preloader").height()/2 ) + "px").css("position","relative");
    //});
  });

}

function hidePreloader() {
  $("#preloader-wrapper").remove();
  $("#preloader").remove();
}