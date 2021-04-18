function get_icon_list() {
    // Show Icon List
    var len = Object.keys(iconlist).length; // icon list
    console.log(len);
    var f = "icons_sorted/";
    for (var i = 1; i < len+1; i++) {
        var fname = Object.keys(iconlist[`${i}`]);
        var tags = iconlist[`${i}`][`${fname}`];
        $("#killicon_list").append(`<img class="selectable-img ${tags}" src="${f}${fname}" data-fname="${fname}">`)
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
            $(this).css("background-color", "#2b793f73");
        } else {
            $(`.${tag}`).css("display", "none");
            $(this).attr('data-sort', "off");
            $(this).css("background-color", "#d4232373");
        }
    })
});
$(document).on("click", ".selectable-img", function() {
    // Select Kill Icon
    var img_id = $(this).attr("data-fname");
    var sel = $(".selectable-img");
    sel.css("border", "0.2em solid #79542B");
    sel.css("background-color", "#F9D483");
    $(this).css("border", "0.2em solid green");
    $(this).css("background-color", "#BDB76B");
    $("#display-feed").attr("data-icon-id", `${img_id}`);
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
    } else {
        df.attr("data-colors", 0);
    }
}

function draw_kill(special) {
    // main function, draws killfeed wannabe
    var image = new Image();
    var special_bg = new Image(); // special_bg BG

    var df = $("#display-feed");

    if (df.attr("data-colors") == 0) {
        // Picks color for Killer and Victim according to data-colors attribute
        var l_name_color = "#A3574A";
        var r_name_color = "#557C83";
    } else {
        var r_name_color = "#A3574A";
        var l_name_color = "#557C83";
    }

    var KILLER = $("#KILLER").val(); // killer name
    var VICTIM = $("#VICTIM").val(); // victim name
    var id = df.attr('data-icon-id'); // icon id from canvas attributes
    image.origin = 'anonymous';
    image.src = $(`[data-fname='${id}']`).attr("src"); // icon

    var c = document.getElementById("display-feed");
    c.width = 1000;
    c.height = 80;
    var ctx = c.getContext("2d");

    // DRAW
    image.onload = function() {
            // SETUP
            var image_width = this.width;
            ctx.font = "bold 125% Verdana";
            var domination_offsetX = 0
            if (special == 1) {
                domination_offsetX = ctx.measureText("is DOMINATING").width;
            }
            var feed_len = 147 + ctx.measureText(KILLER).width + image_width + domination_offsetX + ctx.measureText(VICTIM).width;
            // DRAW RECT
            ctx.roundRect(70, 20, feed_len, c.height, 10);
            ctx.strokeStyle = "#000";
            ctx.fillStyle = '#F1E9CB';
            ctx.fill();
            // DRAW KILLER
            ctx.fillStyle = l_name_color;
            ctx.fillText(KILLER, 90, 58);
            // ICON COORDS
            var destX = 105 + ctx.measureText(KILLER).width;
            var destY = c.height / 2 - this.height / 2 + 9;
            // DRAW special_bg
            if (df.attr("data-special-bg") != "0") {
                ctx.drawImage(
                    special_bg,
                    destX + image_width / 2 - special_bg.width,
                    destY - special_bg.height / 2,
                    special_bg.width * 2,
                    special_bg.height * 2);
            }
            // DRAW ICON
            ctx.drawImage(this, destX, destY);
            // DRAW DOMINATION
            if (special == 1) {
                ctx.fillStyle = '#3e3923';
                ctx.fillText("is DOMINATING", destX + image_width + 14, 58);
            }
            // DRAW VICTIM
            ctx.fillStyle = r_name_color;
            ctx.fillText(VICTIM, destX + image_width + domination_offsetX + (special == 1 ? 24 : 14), 58);
        }
        // SRC
    if (df.attr("data-special-bg") == "1") {
        special_bg.src = $(`[data-fname='Killicon_crit.png']`).attr("src");
    } else {
        special_bg.src = $(`[data-fname='Killicon_australium.png']`).attr("src");
    }
    if (special == 1) {
        image.src = "icons_sorted/Killicon_domination.png";
    } else {
        image.src = $(`[data-fname='${id}']`).attr("src");
    }




}

function save() {
    var canvas = document.getElementById("display-feed");
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL()
    link.click();
    link.delete;
}