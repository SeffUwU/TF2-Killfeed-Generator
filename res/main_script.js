function get_icon_list() {
    // Show Icon List
    var f = "icons/";
    for (var i = 1; i < 249; i++) {
        $("#killicon_list").append(`<img class="selectable-img" src="${f}(${i}).png" data-id="${i}">`)
    }
}
$(document).ready(function() {

    $('#is_crit').change(function() {
        // Crit?
        var df = $("#display-feed");
        if (this.checked) {
            df.attr("data-crit", 1)
        } else {
            df.attr("data-crit", 0)
        }
    });

});
$(document).on("click", ".selectable-img", function() {
    // Select Kill Icon
    var img_id = $(this).attr("data-id");
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

function draw_kill() {
    // main function, draws killfeed wannabe
    var image = new Image();
    var crit = new Image(); // Crit BG

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
    image.src = $(`[data-id='${id}']`).attr("src"); // icon

    var c = document.getElementById("display-feed");
    c.width = 1000;
    c.height = 80;
    var ctx = c.getContext("2d");

    // DRAW
    image.onload = function() {
        // SETUP
        var image_width = this.width;
        ctx.font = "bold 125% sans-serif";
        var feed_len = 137 + ctx.measureText(KILLER).width + image_width + ctx.measureText(VICTIM).width;
        // DRAW RECT
        ctx.roundRect(70, 20, feed_len, c.height, 5);
        ctx.strokeStyle = "#000";
        ctx.fillStyle = '#F1E9CB'
        ctx.fill();
        // DRAW KILLER
        ctx.fillStyle = l_name_color;
        ctx.fillText(KILLER, 90, 58);
        // ICON COORDS
        var destX = 105 + ctx.measureText(KILLER).width;
        var destY = c.height / 2 - this.height / 2 + 10;
        // DRAW CRIT
        if (df.attr("data-crit") == 1) {
            ctx.drawImage(
                crit,
                destX + image_width / 2 - crit.width,
                destY - crit.height / 2,
                crit.width * 2,
                crit.height * 2);
        }
        // DRAW ICON
        ctx.drawImage(this, destX, destY);
        // DRAW VICTIM
        ctx.fillStyle = r_name_color;
        ctx.fillText(VICTIM, destX + image_width + 14, 58);
    }
    image.src = $(`[data-id='${id}']`).attr("src");
    crit.src = $(`[data-id='104']`).attr("src");
}