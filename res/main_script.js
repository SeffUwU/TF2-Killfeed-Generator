function get_icon_list() {
    // Append icons in killicon-container
    var len = Object.keys(iconlist).length; // icon list
    console.log(len);
    var f = "icons_sorted/";
    for (var i = 1; i < len + 1; i++) {
        var fname = Object.keys(iconlist[`${i}`]);
        var tags = iconlist[`${i}`][`${fname}`];
        $(".killicon-container").append(`<div class='list-item ${tags}' data-fname="${fname}"> <img class="selectable-img " src="${f}${fname}" data-fname="${fname}" alt='` + fname.toString().slice(0, -4).replace("_", " ") + `'> </div>`)
    }
}
$(document).ready(function() {
    // special_bg?
    $('#is_crit').change(function() {
        var df = $("#display-feed");
        if (this.checked) {
            df.attr("data-special-bg", 1)
            $('#is_aussie').prop('checked', false);
        } else {
            df.attr("data-special-bg", 0)
        }
    });
    // Aussie?
    $('#is_aussie').change(function() {
        var df = $("#display-feed");
        if (this.checked) {
            df.attr("data-special-bg", 2)
            $('#is_crit').prop('checked', false);
        } else {
            df.attr("data-special-bg", 0)
        }
    });
    // "Sort"
    $('.sortable').click(function() {
        var tag = $(this).attr('data-tags');
        if ($(this).attr('data-sort') == "off") {
            $(`.${tag}`).css("display", "");
            $(this).attr('data-sort', "on");
            $(this).css("background-color", "#2b793f");
        } else {
            $(`.${tag}`).css("display", "none");
            $(this).attr('data-sort', "off");
            $(this).css("background-color", "#d4232373");
        }
    })
});
$(document).on("click", ".list-item", function() {
    // Select Kill Icon
    $('.list-item').removeClass('selected');
    var fname = $(this).attr("data-fname");
    $(this).addClass('selected');

    $("#display-feed").attr("data-icon-id", `${fname}`);
});

CanvasRenderingContext2D.prototype.roundRect = function(sx, sy, ex, ey, r) {
    // Thanks to this guy: https://stackoverflow.com/a/7838871
    // Made rounded rectangles extremely easy. 
    var r2d = Math.PI / 180;
    if ((ex - sx) - (2 * r) < 0) { r = ((ex - sx) / 2); }
    if ((ey - sy) - (2 * r) < 0) { r = ((ey - sy) / 2); }
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
}

function color_switch() {
    // switches data-colors attribute
    var df = $("#display-feed");
    if (df.attr("data-colors") == 0) {
        df.attr("data-colors", 1);
        $('.clr-show-l').css('background', '#004bff');
        $('.clr-show-r').css('background', '#c40000');
    } else {
        df.attr("data-colors", 0);
        $('.clr-show-l').css('background', '#c40000');
        $('.clr-show-r').css('background', '#004bff');
    }
}

function draw_kill(special) {
    let image = new Image();
    let special_bg = new Image(); // special_bg BG
    special_bg.origin = 'anonymous';
    image.origin = 'anonymous';
    let df = $("#display-feed");
    let KILLER = $("#KILLER").val(); // killer name
    let VICTIM = $("#VICTIM").val(); // victim name
    let id = df.attr('data-icon-id'); // icon fname from canvas attributes

    let bg = '#F1E9CB';
    if (!$('#is_init').prop('checked')) {
        // killfeed background, changes according to
        // inititator checkbox
        bg = '#202020';
    }
    if (df.attr("data-colors") == 0) {
        // Picks color for Killer and Victim according to data-colors attribute
        var l_name_color = "#A3574A";
        var r_name_color = "#557C83";
    } else {
        var r_name_color = "#A3574A";
        var l_name_color = "#557C83";
    }



    image.src = 'icons_sorted/' + id; // icon

    let c = document.getElementById("display-feed");
    c.width = 1000;
    c.height = 80;
    let ctx = c.getContext("2d");
    // DRAW
    image.onload = function() {
        // SETUP
        let image_width = 0;
        if ($('#is_drawIcon').prop('checked')) {
            image_width = this.width;
        }
        ctx.font = "bold 125% Verdana";

        let custom_offsetX = 0; // Custom offset. Includes DOMINATION.
        if (special == 1) {
            custom_offsetX = ctx.measureText("is DOMINATING").width;
        } else if (special == 2) {
            custom_offsetX = ctx.measureText($('#custom_special').val()).width;
        }

        let custom_font_clr = '#3e3923'; // Font color changes whenether initiating a kill
        if (!$('#is_init').prop('checked')) {
            custom_font_clr = '#F1E9CB';
        }

        let feed_len = 112 + ctx.measureText(KILLER).width + image_width + custom_offsetX + ctx.measureText(VICTIM).width;
        $('#save').attr('data-img-width', Math.ceil(feed_len));

        // DRAW RECT
        let sorta_mid = (c.width / 2) - feed_len / 2;

        ctx.roundRect(sorta_mid, 20, sorta_mid + feed_len, c.height, 6);
        ctx.strokeStyle = "#000";
        ctx.fillStyle = bg;
        ctx.fill();
        // DRAW KILLER
        ctx.fillStyle = l_name_color;
        ctx.fillText(KILLER, sorta_mid + 38, 58);
        // ICON COORDS
        let icon_offset = 40;
        if ($('#is_drawIcon').prop('checked')) {
            icon_offset = 60;
        }
        let destX = sorta_mid + icon_offset + ctx.measureText(KILLER).width;
        let destY = c.height / 2 - this.height / 2 + 9;
        // DRAW special_bg
        if (df.attr("data-special-bg") != "0") {
            ctx.globalAlpha = 0.75;
            ctx.drawImage(
                special_bg,
                destX + image_width / 2 - special_bg.width,
                destY - special_bg.height / 2,
                special_bg.width * 2,
                special_bg.height * 2);
            ctx.globalAlpha = 1;
        }
        // DRAW ICON
        if ($('#is_drawIcon').prop('checked')) {
            ctx.drawImage(this, destX, destY);

            if (!$('#is_init').prop('checked')) {
                let masked_img = masked_image(this, 64, 60, 36, 255, 25);
                let temp_c = document.createElement('canvas');
                temp_c.width = c.width;
                temp_c.height = c.height;
                let tmpctx = temp_c.getContext('2d');

                tmpctx.drawImage(this, destX, destY);
                tmpctx.globalCompositeOperation = "source-in";
                tmpctx.drawImage(masked_img, destX, destY);
                ctx.drawImage(temp_c, 0, 0);
            }



        }


        // DRAW DOMINATION
        if (special == 1) {
            ctx.fillStyle = custom_font_clr;
            ctx.fillText("is DOMINATING", destX + image_width + 14, 58);
        } else if (special == 2) {
            ctx.fillStyle = custom_font_clr;
            ctx.fillText($('#custom_special').val(), destX + image_width + 14, 58);
        }
        // DRAW VICTIM
        ctx.fillStyle = r_name_color;
        ctx.fillText(VICTIM, destX + image_width + custom_offsetX + ([1, 2].includes(special) ? 24 : 14), 58);


    }

    // SRC
    if (df.attr("data-special-bg") == "1") {
        special_bg.src = $(`img[data-fname='Killicon_crit.png']`).attr("src");
    } else {
        special_bg.src = $(`img[data-fname='Killicon_australium.png']`).attr("src");
    }
    if (special == 1) {
        image.src = "icons_sorted/Killicon_domination.png";
    } else {
        image.src = $(`img[data-fname='${id}']`).attr("src");
    }

}

function masked_image(img, r, g, b, a, precision) {
    // Returns a canvas, that contains only the color defined by
    // RGBA values in a range of (-precision, + precision).
    // Thanks to this guy: https://stackoverflow.com/a/22540439
    // I was able to rewrite parts of his code to use in this project.
    let c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.width;
    ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var canvasImgData = ctx.getImageData(0, 0, c.width, c.height);
    var data = canvasImgData.data;
    for (var i = 0; i < data.length; i += 4) {
        var isInMask = (
            data[i + 0] > (r - precision) && data[i + 0] < (r + precision) &&
            data[i + 1] > (g - precision) && data[i + 1] < (g + precision) &&
            data[i + 2] > (b - precision) && data[i + 2] < (b + precision) &&
            data[i + 3] > 0
        );
        data[i + 0] = (isInMask) ? 241 : 0;
        data[i + 1] = (isInMask) ? 233 : 0;
        data[i + 2] = (isInMask) ? 203 : 0;
        data[i + 3] = (isInMask) ? 255 : 0;
    }
    ctx.putImageData(canvasImgData, 0, 0);

    return c;
}

function save() {
    let feed_len = $("#save").attr("data-img-width");
    let canvas = document.getElementById("display-feed");
    let sorta_mid = (canvas.width / 2) - feed_len / 2;
    let temp_canvas = document.createElement('canvas');
    temp_canvas.width = feed_len;
    temp_canvas.height = 80;
    tctx = temp_canvas.getContext('2d');
    tctx.drawImage(canvas, sorta_mid, 0, feed_len, 80, 0, -10, feed_len, 80);

    var link = document.createElement('a');
    link.download = 'killfeed_generated.png';
    link.href = temp_canvas.toDataURL();
    link.click();
    link.delete;
}