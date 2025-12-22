// Just for context i have no clue what most of the code below does.
// I was going to refactor it.. but now thinking it about i don't want to.
// I'll just update the killicon list and that its.
//
// 12.22.2025: I rewrote parts of this code and i guess it's a bit more readable,
// but it's still such a mess..
const [BLUE_TEAM_CLR, RED_TEAM_CLR] = ["#557C83", "#A3574A"];

let df;
function get_icon_list() {
  // Append icons in killicon-container
  var len = Object.keys(iconList).length; // icon list
  console.log(`Icon amount: ${len}`);
  var f = "icons_sorted/";

  for (var i = 1; i < len + 1; i++) {
    var fname = Object.keys(iconList[`${i}`]);
    var tags = iconList[i][fname];
    $(".killicon-container").append(
      `<div class='list-item ${tags}' data-fname="${fname}">
        <img class="selectable-img " src="${f}${fname}" data-fname="${fname}" alt='${fname
        .toString()
        .slice(0, -4)
        .replace("_", " ")}'>
       </div>`
    );
  }
}

$(document).ready(function () {
  /*  SORTING IN THIS BLOCK */
  let hide = [];

  $(".sortable").on("click", function () {
    const tag = $(this).attr("data-tags");
    $(`.list-item`).css("display", "");
    if ($(this).attr("data-sort") == "off") {
      hide = hide.filter((el) => el !== `.${tag}`);
      $(this).attr("data-sort", "on");
    } else {
      hide.push(`.${tag}`);
      $(this).attr("data-sort", "off");
    }
    $(hide.join(",")).css("display", "none");
  });

  $("#deselect-all").click(function () {
    const s = $(".sortable");
    s.attr("data-sort", "on");
    s.click();
  });
  /****************************/

  df = $("#display-feed");

  // killstreak
  $("#is_killstreak").on("input", () => {
    let ks_count = $("#is_killstreak").val();
    $("#display-feed").attr("data-is-ks", ks_count >= 0 ? ks_count : 0);
  });

  // special_bg?
  $("#is_crit").change(function () {
    if (this.checked) {
      df.attr("data-special-bg", 1);
      return $("#is_aussie").prop("checked", false);
    }

    df.attr("data-special-bg", 0);
  });

  // Aussie?
  $("#is_aussie").change(function () {
    if (this.checked) {
      df.attr("data-special-bg", 2);
      return $("#is_crit").prop("checked", false);
    }

    df.attr("data-special-bg", 0);
  });

  $("#is_teamkill").change(function () {
    if (this.checked) {
      df.attr("data-teamkill", 1);

      color_switch();

      return $("#is_crit").prop("checked", false);
    }

    df.attr("data-teamkill", 0);

    color_switch();
  });

  /* Draw kill on icon select */
  $(document).on("click", ".list-item", function () {
    const fname = $(this).attr("data-fname");

    $(".list-item").removeClass("selected");
    $(this).addClass("selected");
    $("#display-feed").attr("data-icon-name", `${fname}`);

    if (df.attr("data-custom-pos")) {
      draw_kill(2);
    } else {
      draw_kill();
    }
  });

  /* Draw kill on any of checkboxes changed */
  $(".option-checkbox").change(function () {
    if ($("#is_init").prop("checked")) {
      $("#transparent_bg").attr("disabled", true);
    } else {
      $("#transparent_bg").attr("disabled", false);
    }

    if (df.attr("data-custom-pos")) {
      draw_kill(2);
    } else {
      draw_kill();
    }
  });

  // on VICTIM or KILLER change draw kill
  $("#KILLER, #VICTIM, #is_killstreak, #custom_special").on("input", () => {
    if (df.attr("data-custom-pos")) {
      draw_kill(2);
    } else if ($("#updateOnChange").prop("checked")) {
      draw_kill();
    }
  });

  /**
   * Save custom text location idx
   * 0 - {TEXT} KILLER ICON VICTIM
   * 1 - KILLER {TEXT} ICON VICTIM
   * 2 - KILLER ICON {TEXT} VICTIM
   * 3 - KILLER ICON VICTIM {TEXT}
   */
  $(".custom-text-selector-button").on("click", function () {
    const newIdx = $(this).attr("data-idx");
    console.log("CUSTOM", df.attr("data-custom-pos"), newIdx);

    $(".custom-text-selector-button").removeAttr("style");

    if (df.attr("data-custom-pos") == newIdx) {
      df.attr("data-custom-pos", null);
    } else {
      df.attr("data-custom-pos", newIdx);
      $(this).css({ "background-color": "#F1E9CB" });
    }

    draw_kill(2);
  });

  draw_kill();
});

/* Team color switch */
/**
 * TEAM-KILL === 0:
 *    0 = RED  - BLUE
 *    1 = BLUE - RED
 * TEAM-KILL === 1:
 *    0 = RED  - RED
 *    1 = BLUE - BLUE
 */
async function color_switch() {
  df.attr("data-colors", df.attr("data-colors") == 0 ? 1 : 0);

  const [left, right] = returnTeamColorTuple();

  $(".clr-show-l").css("background", left);
  $(".clr-show-r").css("background", right);

  if (df.attr("data-custom-pos")) {
    draw_kill(2);
  } else {
    draw_kill();
  }
}

function returnTeamColorTuple() {
  // console.log("teamKill", df.attr("data-teamkill"));
  // console.log("colors", df.attr("data-colors"));

  if (df.attr("data-teamkill") == 1) {
    if (df.attr("data-colors") == 0) {
      return [RED_TEAM_CLR, RED_TEAM_CLR];
    } else {
      return [BLUE_TEAM_CLR, BLUE_TEAM_CLR];
    }
  } else {
    if (df.attr("data-colors") == 0) {
      return [RED_TEAM_CLR, BLUE_TEAM_CLR];
    } else {
      return [BLUE_TEAM_CLR, RED_TEAM_CLR];
    }
  }
}

/**
 * @param {number} special:
 * > 0 - nothing
 * > 1 - DOMINATION
 * > 2 - CUSTOM TEXT
 * > 3 - PAINFUL DEATH
 */
function draw_kill(special) {
  if (!df) {
    return;
  }

  const canvas = document.getElementById("display-feed");
  const [cWidth, cHeight] = [canvas.width, canvas.height];

  const ctx = canvas.getContext("2d");
  const customTextPosIdx = parseInt(df.attr("data-custom-pos")) || 0;

  // prepare Assets
  const killstreakImg = new Image();
  const isKillstreak = df.attr("data-is-ks") > 0;
  const iconImg = new Image();
  const specialBg = new Image(); // The Crit/Aussie background

  specialBg.origin = "anonymous";
  iconImg.origin = "anonymous";

  const iconId = df.attr("data-icon-name");
  // 1 = crit, 2 = aussie
  const specialBgType = df.attr("data-special-bg");
  // grab text and colors
  const [KILLER, VICTIM] = [$("#KILLER").val(), $("#VICTIM").val()];
  const [l_name_color, r_name_color] = returnTeamColorTuple();
  const customTextFontColor = $("#is_init").prop("checked")
    ? "#3e3923" // Initiator
    : "#F1E9CB"; // Non Initiator

  const textConstants = {
    0: "unused",
    1: "is DOMINATING",
    2: $("#custom_special").val(),
    3: "fell to a clumsy, painful death",
  };

  const specialText = textConstants[special] || "";

  // load special bg image
  if (specialBgType != "0") {
    specialBg.src =
      specialBgType == "1"
        ? "icons_sorted/Killicon_crit.png"
        : "icons_sorted/Killicon_australium.png";
  }
  // load killstreak image
  if (isKillstreak) {
    killstreakImg.src = !$("#is_init").prop("checked")
      ? "icons_sorted/Killstreak_Icon02.png"
      : "icons_sorted/Killstreak_Icon.png";
  }

  iconImg.onload = function () {
    ctx.clearRect(0, 0, cWidth, cHeight);

    // setup font and define constants
    ctx.font = "bold 125% Verdana";
    const imgScaleMuliplier = 1.52;
    const elementSpacing = 15;

    // calc widthds
    const killerWidth = special == 3 ? 0 : ctx.measureText(KILLER).width;
    const victimWidth = ctx.measureText(VICTIM).width;
    const specialWidth = specialText ? ctx.measureText(specialText).width : 0;
    const iconWidth = $("#is_drawIcon").prop("checked")
      ? this.width * imgScaleMuliplier
      : 0;

    // change font
    ctx.font = "bold 20px Verdana";

    const killstreakCount = df.attr("data-is-ks");
    const killstreakTextWidth = isKillstreak
      ? ctx.measureText(killstreakCount).width + 5
      : 0;

    // approximate KS icon width
    const killstreakIconWidth = isKillstreak ? 25 : 0;

    const widthFinalKillstreak =
      iconWidth + killstreakTextWidth + killstreakIconWidth;

    // reset
    ctx.font = "bold 125% Verdana";

    // segment order
    // {
    //    type: 'killer' | 'victim' | 'icon' | 'text',
    //    width: float
    // }
    const segments = [
      { id: "killer", w: killerWidth, active: special != 3 },
      { id: "icon", w: widthFinalKillstreak, active: true },
      { id: "victim", w: victimWidth, active: true },
    ];

    if (specialText) {
      if (df.attr("data-custom-pos")) {
        segments.splice(customTextPosIdx, 0, {
          id: "text",
          w: specialWidth,
          active: true,
        });
      } else if (special === 3)
        segments.splice(3, 0, { id: "text", w: specialWidth, active: true });
    }
    // calc feed length
    const activeSegments = segments.filter((s) => s.active && s.w > 0);
    const totalContentWidth = activeSegments.reduce((sum, s) => sum + s.w, 0);
    const totalSpacing = (activeSegments.length + 1) * elementSpacing;
    const feedLength = totalContentWidth + totalSpacing + 20; // +20 for extra padding

    $("#save").attr("data-img-width", Math.ceil(feedLength));

    // draw background
    const startX = cWidth / 2 - feedLength / 2;
    const bg = $("#is_init").prop("checked")
      ? "#E2CDB2"
      : `#202020` + ($("#transparent_bg").prop("checked") ? "c8" : "");

    // TODO: this controls height of feed. Probably add a toggle for slighly slimmer height
    ctx.roundRect(startX, 20, startX + feedLength, cHeight, 6);
    ctx.fillStyle = bg;
    ctx.fill();

    let currentX = startX + elementSpacing + 10;

    // draw segments
    activeSegments.forEach((seg) => {
      // TODO: probably rewrite to switch but idc
      if (seg.id === "killer") {
        ctx.fillStyle = l_name_color;
        ctx.fillText(KILLER, currentX, 58);
      } else if (seg.id === "text") {
        ctx.fillStyle = customTextFontColor;
        ctx.fillText(specialText, currentX, 58);
      } else if (seg.id === "victim") {
        ctx.fillStyle = r_name_color;
        ctx.fillText(VICTIM, currentX, 58);
      } else if (seg.id === "icon") {
        const iconDrawX = currentX;
        const mainIconX = iconDrawX + killstreakTextWidth + killstreakIconWidth;
        const h = this.height;
        const destY = cHeight / 2 - h / 2 + 9 - h / 4;

        // draw special bg
        if (specialBgType != "0" && specialBg.complete) {
          const s_scale = imgScaleMuliplier + 0.8;
          ctx.globalAlpha = 0.85;

          // center glow/sheen on the weapon icon
          ctx.drawImage(
            specialBg,
            mainIconX + iconWidth / 2 - (specialBg.width * s_scale) / 2,
            cHeight / 6,
            specialBg.width * s_scale,
            specialBg.height * s_scale
          );
          ctx.globalAlpha = 1;
        }

        // draw ks if enabled
        if (isKillstreak) {
          ctx.font = "bold 20px Verdana";
          ctx.fillStyle = $("#is_init").prop("checked") ? "#202020" : "#f1e9cb";
          ctx.fillText(killstreakCount, iconDrawX, 58);
          ctx.drawImage(
            killstreakImg,
            iconDrawX + killstreakTextWidth,
            cHeight / 2,
            killstreakImg.width / 1.7,
            killstreakImg.height / 1.7
          );

          // reset
          ctx.font = "bold 125% Verdana";
        }

        // main icon
        if ($("#is_drawIcon").prop("checked")) {
          ctx.drawImage(
            this,
            mainIconX,
            destY,
            this.width * imgScaleMuliplier,
            h * imgScaleMuliplier
          );

          applyIconMask(
            ctx,
            this,
            mainIconX,
            destY,
            imgScaleMuliplier,
            special,
            cWidth,
            cHeight
          );
        }
      }
      currentX += seg.w + elementSpacing;
    });
  };

  iconImg.src =
    special == 1
      ? "icons_sorted/Killicon_domination.png"
      : special == 3
      ? "icons_sorted/Killicon_skull.png"
      : $(`img[data-fname='${iconId}']`).attr("src");
}

function applyIconMask(ctx, img, x, y, scale, special, cw, ch) {
  if ($("#is_init").prop("checked") && special != 1) return;

  const w = img.width;
  const h = img.height;
  let masked_img =
    special == 1
      ? masked_image(img, 245, 229, 193, 255, 10, w, h, scale)
      : masked_image(img, 64, 60, 36, 255, 55, w, h, scale);

  const temp_c = document.createElement("canvas");
  const tempctx = temp_c.getContext("2d");
  temp_c.width = cw;
  temp_c.height = ch;

  tempctx.drawImage(img, x, y, w * scale, h * scale);
  tempctx.globalCompositeOperation = "source-in";
  tempctx.drawImage(masked_img, x, y);
  ctx.drawImage(temp_c, 0, 0);
}

function save() {
  const feedLength = $("#save").attr("data-img-width");
  const canvas = document.getElementById("display-feed");
  const approximateCenter = canvas.width / 2 - feedLength / 2;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = feedLength;
  tempCanvas.height = 80;
  tctx = tempCanvas.getContext("2d");
  tctx.drawImage(
    canvas,
    approximateCenter,
    0,
    feedLength,
    80,
    0,
    -10,
    feedLength,
    80
  );

  const link = document.createElement("a");
  link.download = "killfeed_generated.png";
  link.href = tempCanvas.toDataURL();
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
