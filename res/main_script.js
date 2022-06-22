let df;
function get_icon_list() {
  // Append icons in killicon-container
  var len = Object.keys(iconlist).length; // icon list
  console.log(len);
  var f = "icons_sorted/";
  for (var i = 1; i < len + 1; i++) {
    var fname = Object.keys(iconlist[`${i}`]);
    var tags = iconlist[`${i}`][`${fname}`];
    $(".killicon-container").append(
      `<div class='list-item ${tags}' data-fname="${fname}"> <img class="selectable-img " src="${f}${fname}" data-fname="${fname}" alt='` +
        fname.toString().slice(0, -4).replace("_", " ") +
        `'> </div>`
    );
  }
}
/*  SORTING IN THIS BLOCK */
$(document).ready(() => {
  let hide = [];
  $(".sortable").click(function () {
    const tag = $(this).attr("data-tags");
    $(`.list-item`).css("display", "");
    if ($(this).attr("data-sort") == "off") {
      hide = hide.filter((el) => el !== `.${tag}`);
      console.log(`.${tag}`);
      $(this).attr("data-sort", "on");
    } else {
      hide.push(`.${tag}`);
      $(this).attr("data-sort", "off");
    }
    $(hide.join(",")).css("display", "none");
  });
});

$(document).ready(function () {
  df = $("#display-feed");
  // on VICTIM or KILLER change draw kill
  $("#KILLER, #VICTIM, #is_killstreak").on("input", () => {
    if ($("#updateOnChange").prop("checked")) {
      draw_kill();
    }
  });

  // killstreak
  $("#is_killstreak").on("input", () => {
    let ks_count = $("#is_killstreak").val();
    $("#display-feed").attr("data-is-ks", ks_count >= 0 ? ks_count : 0);
  });

  // special_bg?
  $("#is_crit").change(function () {
    if (this.checked) {
      df.attr("data-special-bg", 1);
      $("#is_aussie").prop("checked", false);
    } else {
      df.attr("data-special-bg", 0);
    }
  });

  // Aussie?
  $("#is_aussie").change(function () {
    if (this.checked) {
      df.attr("data-special-bg", 2);
      $("#is_crit").prop("checked", false);
    } else {
      df.attr("data-special-bg", 0);
    }
  });

  // click kill btn if pressed enter
  $(".name-input").keypress(function (e) {
    if ((e.keyCode == 10 || e.keyCode == 13) && e.shiftKey) {
      $("#kill_btn_dom").click();
    } else if (e.keyCode == 10 || e.keyCode == 13) $("#kill_btn").click();
  });
});

$(document).on("click", ".list-item", function () {
  // Select Kill Icon & draw
  const fname = $(this).attr("data-fname");

  $(".list-item").removeClass("selected");
  $(this).addClass("selected");
  $("#display-feed").attr("data-icon-id", `${fname}`);

  draw_kill();
});

function color_switch() {
  // switches data-colors attribute
  if (df.attr("data-colors") == 0) {
    df.attr("data-colors", 1);
    $(".clr-show-l").css("background", "#004bff");
    $(".clr-show-r").css("background", "#c40000");
  } else {
    df.attr("data-colors", 0);
    $(".clr-show-l").css("background", "#c40000");
    $(".clr-show-r").css("background", "#004bff");
  }
}

function draw_kill(special) {
  const [cWidth, cHeight] = [1000, 80]; // Canvas size
  const ks = new Image(); // Killstreak image
  const is_ks = df.attr("data-is-ks") > 0 ? true : false;

  /* Special */
  const special_bg = new Image(); // special_bg BG
  special_bg.origin = "anonymous";

  /* Kill icon */
  const image = new Image(); // Kill icon
  image.origin = "anonymous";

  /* Killer and Victim strings */
  const KILLER = $("#KILLER").val();
  const VICTIM = $("#VICTIM").val();

  /* Path to kill icon */
  const id = df.attr("data-icon-id");

  /* bg color */
  let bg = $("#is_init").prop("checked") ? "#F1E9CB" : "#202020";

  /* Left and Right text colors */
  const l_name_color = df.attr("data-colors") == 0 ? "#A3574A" : "#557C83";
  const r_name_color = df.attr("data-colors") == 0 ? "#557C83" : "#A3574A";

  /* Canvas */
  const c = document.getElementById("display-feed");

  /* Differently colored KS if kill is initialized */
  if (is_ks == true) {
    ks.src = !$("#is_init").prop("checked")
      ? "icons_sorted/Killstreak_Icon02.png"
      : "icons_sorted/Killstreak_Icon.png";
  }

  /* Setting kill icon */
  image.src = "icons_sorted/" + id;

  /* Setting canvas size */
  c.width = cWidth;
  c.height = cHeight;

  /* Setting up context */
  const ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled = true;

  /* Drawing process (such a mess) */
  image.onload = function () {
    ctx.font = "bold 125% Verdana";
    /* setup for some killicon scale */
    const image_scale_multiplier = 1.52;
    const image_width = $("#is_drawIcon").prop("checked")
      ? this.width * image_scale_multiplier
      : 0;

    /* font colors */
    const custom_font_clr = $("#is_init").prop("checked")
      ? "#3e3923"
      : "#F1E9CB";

    /* Killstreak count */
    const ks_count = df.attr("data-is-ks");

    /* custom offset */
    let custom_offsetX =
      0 +
      (special == 1
        ? ctx.measureText("is DOMINATING").width
        : special == 2
        ? ctx.measureText($("#custom_special").val()).width
        : 0);

    /* adding image width to custom offset */
    custom_offsetX += image_width;

    /* next ks offset to custom offset */
    ctx.font = "bold 20px Verdana";
    ks_offset = is_ks == true ? ctx.measureText(ks_count).width + 30 : 0; // ks offset in px
    ctx.font = "bold 125% Verdana"; // reset font

    /* This mess of stuff... */
    const feed_len =
      112 +
      ctx.measureText(KILLER).width +
      custom_offsetX +
      ctx.measureText(VICTIM).width +
      ks_offset;

    /* i guess setting up the save button? */
    $("#save").attr("data-img-width", Math.ceil(feed_len + 1));

    /* Drawin rectangle */
    const sorta_mid = c.width / 2 - feed_len / 2;

    ctx.roundRect(sorta_mid, 20, sorta_mid + feed_len, c.height, 6);
    ctx.strokeStyle = "#000";
    ctx.fillStyle = bg;
    ctx.fill();

    // DRAW KILLER
    ctx.fillStyle = l_name_color;
    ctx.fillText(KILLER, sorta_mid + 38, 58);

    // ICON COORDS
    const icon_offset =
      ks_offset + ($("#is_drawIcon").prop("checked") ? 50 : 40);

    const destX = sorta_mid + icon_offset + ctx.measureText(KILLER).width;
    const destY = c.height / 2 - this.height / 2 + 9;

    // DRAW KILLSTREAK
    if (is_ks > 0) {
      ctx.font = "bold 20px Verdana";
      ctx.fillStyle = $("#is_init").prop("checked") ? "#202020" : "#f1e9cb";
      ctx.fillText(ks_count, destX - ks_offset, 58);
      const ks_len = ctx.measureText(ks_count).width;
      ctx.drawImage(
        ks,
        ks_len + destX - ks_offset,
        cHeight / 2,
        ks.height / 1.7,
        ks.width / 1.7
      );

      ctx.font = "bold 125% Verdana"; //font reset
    }

    // DRAW special_bg
    if (df.attr("data-special-bg") != "0") {
      const special_bg_scale = image_scale_multiplier + 0.8;
      ctx.globalAlpha = 0.85;
      ctx.globalCompositeOperation = "source-atop";

      ctx.drawImage(
        special_bg,
        destX + image_width / 2 - (special_bg.width * special_bg_scale) / 2,
        cHeight / 6,
        special_bg.width * special_bg_scale,
        special_bg.height * special_bg_scale
      );

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    // DRAW ICON
    if ($("#is_drawIcon").prop("checked")) {
      const w = this.width;
      const h = this.height;
      ctx.drawImage(
        this,
        destX,
        destY - h / 4,
        w * image_scale_multiplier,
        h * image_scale_multiplier
      );
      if (!$("#is_init").prop("checked") || special == 1) {
        // Invert the colors of kill icon, if not initiationg a kill.
        let masked_img =
          special == 1
            ? masked_image(
                this,
                245,
                229,
                193,
                255,
                10,
                w,
                h,
                image_scale_multiplier
              )
            : masked_image(
                this,
                64,
                60,
                36,
                255,
                55,
                w,
                h,
                image_scale_multiplier
              );

        const temp_c = document.createElement("canvas");
        const tempctx = temp_c.getContext("2d");
        temp_c.width = c.width;
        temp_c.height = c.height;

        tempctx.drawImage(
          this,
          destX,
          destY - h / 4,
          w * image_scale_multiplier,
          h * image_scale_multiplier
        );

        tempctx.globalCompositeOperation = "source-in";
        tempctx.drawImage(masked_img, destX, destY - h / 4);
        ctx.drawImage(temp_c, 0, 0);
        temp_c.delete;
      }
    }
    // DRAW SPECIAL
    if (special == 1) {
      ctx.fillStyle = custom_font_clr;
      ctx.fillText("is DOMINATING", destX + image_width + 14, 58);
    } else if (special == 2) {
      ctx.fillStyle = custom_font_clr;
      ctx.fillText($("#custom_special").val(), destX + image_width + 14, 58);
    }
    // DRAW VICTIM
    ctx.fillStyle = r_name_color;
    ctx.fillText(VICTIM, destX + custom_offsetX + (special ? 24 : 14), 58);
  };

  // SRC
  special_bg.src = $(
    df.attr("data-special-bg") == "1"
      ? `img[data-fname='Killicon_crit.png']`
      : `img[data-fname='Killicon_australium.png']`
  ).attr("src");

  image.src =
    special == 1
      ? "icons_sorted/Killicon_domination.png"
      : $(`img[data-fname='${id}']`).attr("src");
}

function save() {
  const feed_len = $("#save").attr("data-img-width");
  const canvas = document.getElementById("display-feed");
  const sorta_mid = canvas.width / 2 - feed_len / 2;
  const temp_canvas = document.createElement("canvas");
  temp_canvas.width = feed_len;
  temp_canvas.height = 80;
  tctx = temp_canvas.getContext("2d");
  tctx.drawImage(canvas, sorta_mid, 0, feed_len, 80, 0, -10, feed_len, 80);

  const link = document.createElement("a");
  link.download = "killfeed_generated.png";
  link.href = temp_canvas.toDataURL();
  link.click();
  link.delete;
}

function masked_image(img, r, g, b, a, precision, sw, sh, scale = 1) {
  // Returns a canvas, that contains only the color defined by
  // RGBA values in a range of (-precision, +precision).
  // Thanks to this guy: https://stackoverflow.com/a/22540439
  // I was able to rewrite parts of his code to use in this project.
  let c = document.createElement("canvas");
  c.width = sw * scale;
  c.height = sh * scale;
  ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, sw * scale, sh * scale);

  var canvasImgData = ctx.getImageData(0, 0, c.width, c.height);
  var data = canvasImgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var isInMask =
      data[i + 0] > r - precision &&
      data[i + 0] < r + precision &&
      data[i + 1] > g - precision &&
      data[i + 1] < g + precision &&
      data[i + 2] > b - precision &&
      data[i + 2] < b + precision &&
      data[i + 3] > 0;
    data[i + 0] = isInMask ? 241 : 0;
    data[i + 1] = isInMask ? 233 : 0;
    data[i + 2] = isInMask ? 203 : 0;
    data[i + 3] = isInMask ? 255 : 0;
  }
  ctx.putImageData(canvasImgData, 0, 0);
  return c;
}
CanvasRenderingContext2D.prototype.roundRect = function (sx, sy, ex, ey, r) {
  // Thanks to this guy: https://stackoverflow.com/a/7838871
  // Made rounded rectangles extremely easy.
  var r2d = Math.PI / 180;
  if (ex - sx - 2 * r < 0) {
    r = (ex - sx) / 2;
  }
  if (ey - sy - 2 * r < 0) {
    r = (ey - sy) / 2;
  }
  this.beginPath();
  this.moveTo(sx + r, sy);
  this.lineTo(ex - r, sy);
  this.arc(ex - r, sy + r, r, r2d * 270, r2d * 360, false);
  this.lineTo(ex, ey - r);
  this.arc(ex - r, ey - r, r, r2d * 0, r2d * 90, false);
  this.lineTo(sx + r, ey);
  this.arc(sx + r, ey - r, r, r2d * 90, r2d * 180, false);
  this.lineTo(sx, sy + r);
  this.arc(sx + r, sy + r, r, r2d * 180, r2d * 270, false);
  this.closePath();
};
