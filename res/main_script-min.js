let df;function get_icon_list(){var c=Object.keys(iconlist).length;console.log(c);for(var b=1;b<c+1;b++){var a=Object.keys(iconlist[`${b}`]),d=iconlist[`${b}`][`${a}`];$(".killicon-container").append(`<div class='list-item ${d}' data-fname="${a}"> <img class="selectable-img " src="icons_sorted/${a}" data-fname="${a}" alt='`+a.toString().slice(0,-4).replace("_"," ")+"'> </div>")}}function color_switch(){0==df.attr("data-colors")?(df.attr("data-colors",1),$(".clr-show-l").css("background","#004bff"),$(".clr-show-r").css("background","#c40000")):(df.attr("data-colors",0),$(".clr-show-l").css("background","#c40000"),$(".clr-show-r").css("background","#004bff"))}function draw_kill(e){let[f,g]=[1e3,80],h=new Image,i=df.attr("data-is-ks")>0,c=new Image;c.origin="anonymous";let a=new Image;a.origin="anonymous";let k=$("#KILLER").val(),l=$("#VICTIM").val(),d=df.attr("data-icon-id"),m=$("#is_init").prop("checked")?"#F1E9CB":"#202020",n=0==df.attr("data-colors")?"#A3574A":"#557C83",o=0==df.attr("data-colors")?"#557C83":"#A3574A",b=document.getElementById("display-feed");!0==i&&(h.src=$("#is_init").prop("checked")?"icons_sorted/Killstreak_Icon.png":"icons_sorted/Killstreak_Icon02.png"),a.src="icons_sorted/"+d,b.width=f,b.height=g;let j=b.getContext("2d");j.imageSmoothingEnabled=!0,a.onload=function(){j.font="bold 125% Verdana";let d=1.52,q=$("#is_drawIcon").prop("checked")?this.width*d:0,z=$("#is_init").prop("checked")?"#3e3923":"#F1E9CB",t=df.attr("data-is-ks"),u=0+(1==e?j.measureText("is DOMINATING").width:2==e?j.measureText($("#custom_special").val()).width:0);u+=q,j.font="bold 20px Verdana",ks_offset=!0==i?j.measureText(t).width+30:0,j.font="bold 125% Verdana";let v=112+j.measureText(k).width+u+j.measureText(l).width+ks_offset;$("#save").attr("data-img-width",Math.ceil(v+1));let r=b.width/2-v/2;j.roundRect(r,20,r+v,b.height,6),j.strokeStyle="#000",j.fillStyle=m,j.fill(),j.fillStyle=n,j.fillText(k,r+38,58);let A=ks_offset+($("#is_drawIcon").prop("checked")?50:40),a=r+A+j.measureText(k).width,w=b.height/2-this.height/2+9;if(i>0){j.font="bold 20px Verdana",j.fillStyle=$("#is_init").prop("checked")?"#202020":"#f1e9cb",j.fillText(t,a-ks_offset,58);let B=j.measureText(t).width;j.drawImage(h,B+a-ks_offset,g/2,h.height/1.7,h.width/1.7),j.font="bold 125% Verdana"}if("0"!=df.attr("data-special-bg")){let x=d+.8;j.globalAlpha=.85,j.globalCompositeOperation="source-atop",j.drawImage(c,a+q/2-c.width*x/2,g/6,c.width*x,c.height*x),j.globalAlpha=1,j.globalCompositeOperation="source-over"}if($("#is_drawIcon").prop("checked")){let s=this.width,f=this.height;if(j.drawImage(this,a,w-f/4,s*d,f*d),!$("#is_init").prop("checked")||1==e){let C=1==e?masked_image(this,245,229,193,255,10,s,f,d):masked_image(this,64,60,36,255,55,s,f,d),p=document.createElement("canvas"),y=p.getContext("2d");p.width=b.width,p.height=b.height,y.drawImage(this,a,w-f/4,s*d,f*d),y.globalCompositeOperation="source-in",y.drawImage(C,a,w-f/4),j.drawImage(p,0,0),p.delete}}1==e?(j.fillStyle=z,j.fillText("is DOMINATING",a+q+14,58)):2==e&&(j.fillStyle=z,j.fillText($("#custom_special").val(),a+q+14,58)),j.fillStyle=o,j.fillText(l,a+u+(e?24:14),58)},c.src=$("1"==df.attr("data-special-bg")?"img[data-fname='Killicon_crit.png']":"img[data-fname='Killicon_australium.png']").attr("src"),a.src=1==e?"icons_sorted/Killicon_domination.png":$(`img[data-fname='${d}']`).attr("src")}function save(){let a=$("#save").attr("data-img-width"),d=document.getElementById("display-feed"),e=d.width/2-a/2,b=document.createElement("canvas");b.width=a,b.height=80,(tctx=b.getContext("2d")).drawImage(d,e,0,a,80,0,-10,a,80);let c=document.createElement("a");c.download="killfeed_generated.png",c.href=b.toDataURL(),c.click(),c.delete}function masked_image(m,g,h,i,n,c,j,k,e=1){let d=document.createElement("canvas");d.width=j*e,d.height=k*e,(ctx=d.getContext("2d")).drawImage(m,0,0,j*e,k*e);for(var l=ctx.getImageData(0,0,d.width,d.height),b=l.data,a=0;a<b.length;a+=4){var f=b[a+0]>g-c&&b[a+0]<g+c&&b[a+1]>h-c&&b[a+1]<h+c&&b[a+2]>i-c&&b[a+2]<i+c&&b[a+3]>0;b[a+0]=f?241:0,b[a+1]=f?233:0,b[a+2]=f?203:0,b[a+3]=f?255:0}return ctx.putImageData(l,0,0),d}$(document).ready(()=>{let a=[];$(".sortable").click(function(){let b=$(this).attr("data-tags");$(".list-item").css("display",""),"off"==$(this).attr("data-sort")?(a=a.filter(a=>a!==`.${b}`),console.log(`.${b}`),$(this).attr("data-sort","on")):(a.push(`.${b}`),$(this).attr("data-sort","off")),$(a.join(",")).css("display","none")})}),$(document).ready(function(){df=$("#display-feed"),$("#KILLER, #VICTIM, #is_killstreak").on("input",()=>{$("#updateOnChange").prop("checked")&&draw_kill()}),$("#is_killstreak").on("input",()=>{let a=$("#is_killstreak").val();$("#display-feed").attr("data-is-ks",a>=0?a:0)}),$("#is_crit").change(function(){this.checked?(df.attr("data-special-bg",1),$("#is_aussie").prop("checked",!1)):df.attr("data-special-bg",0)}),$("#is_aussie").change(function(){this.checked?(df.attr("data-special-bg",2),$("#is_crit").prop("checked",!1)):df.attr("data-special-bg",0)}),$(".name-input").keypress(function(a){(10==a.keyCode||13==a.keyCode)&&a.shiftKey?$("#kill_btn_dom").click():(10==a.keyCode||13==a.keyCode)&&$("#kill_btn").click()})}),$(document).on("click",".list-item",function(){let a=$(this).attr("data-fname");$(".list-item").removeClass("selected"),$(this).addClass("selected"),$("#display-feed").attr("data-icon-id",`${a}`),draw_kill()}),CanvasRenderingContext2D.prototype.roundRect=function(c,d,e,f,a){var b=Math.PI/180;e-c-2*a<0&&(a=(e-c)/2),f-d-2*a<0&&(a=(f-d)/2),this.beginPath(),this.moveTo(c+a,d),this.lineTo(e-a,d),this.arc(e-a,d+a,a,270*b,360*b,!1),this.lineTo(e,f-a),this.arc(e-a,f-a,a,0*b,90*b,!1),this.lineTo(c+a,f),this.arc(c+a,f-a,a,90*b,180*b,!1),this.lineTo(c,d+a),this.arc(c+a,d+a,a,180*b,270*b,!1),this.closePath()}