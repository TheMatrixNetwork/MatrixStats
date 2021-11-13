function genSkin(skinName) {
  var skinRender = new SkinRender({
    autoResize: true,
    render: {
      taa: true
    },
    makeNonTransparentOpaque: false
  }, document.getElementById("skinContainer"));
  skinRender.render({
    username: skinName,
    optifine: true
  });
  if (location.hash) $("#nameInput").val(location.hash.substring(1));
  $("#nameInput,#capeInput,#slim").on("change", function () {
    skinRender.clearScene();
    var skin = $("#nameInput").val();
    var cape = $("#capeInput").val();
    var slim =  $("#slim").is(":checked");
    var options = {};
    if (skin.indexOf("http") === 0) {
      options.url = skin;
    } else {
      options.username = skin;
      location.hash = skin;
    }
    if (cape && cape.length > 0) {
      if (cape.includes("capes.dev") || !cape.startsWith("http")) { // capes.dev link or type
        options.cape = cape;
      } else {
        options.capeUrl = cape;
        options.optifine = cape.toLowerCase().indexOf("optifine") > 0;
      }
    }
    options.slim = slim;
    skinRender.render(options);
  })

  $(".partToggle").on("change", function () {
    skinRender.getModelByName($(this).attr("id")).visible = $(this).is(":checked");
  });

  var animate = true;
  $("#animate").on("change", function () {
    animate = $(this).is(":checked");
  });



  var startTime = Date.now();
  document.body.addEventListener("skinRender", function (e) {
    if (animate) {
      var t = (Date.now() - startTime) / 1000;
      e.detail.playerModel.children[2].rotation.x = Math.sin(t * 5) / 2;
      e.detail.playerModel.children[3].rotation.x = -Math.sin(t * 5) / 2;
      e.detail.playerModel.children[4].rotation.x = Math.sin(t * 5) / 2;
      e.detail.playerModel.children[5].rotation.x = -Math.sin(t * 5) / 2;
    }
  })
}
