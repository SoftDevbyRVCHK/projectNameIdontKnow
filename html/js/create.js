const field = document.getElementById("field");
field.setAttribute("viewBox", "0 0 " + window.screen.width + " " + window.screen.height);
const audio = new Audio('data/audio/bip.mp3');

const xs=9;
const ys=9;

let n =1;

cash = new Map();

let matrix = "  XXXXXX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX      XX";
const ln = 10;
const dl = 5;


function line(x1, y1, x2, y2, col) {
    d3.select("svg").append("line").attr("x1", x1).attr("x2", x2).attr("y1", y1).attr("y2", y2).attr("stroke", col);
}

async function image(x, y, src, id=0) {
    let w1, h1;
    if (!cash.has(src)){
        var im = new Image();
        im.src = src;
        await im.decode();
        w1 = im.naturalWidth;
        h1 = im.naturalHeight;
        cash.set(src, {w:im.naturalWidth, h:im.naturalHeight});
    }
    w1 = cash.get(src).w;
    h1 = cash.get(src).h;
    if (id != 0)
        d3.select("svg").append("image").attr("x", x).attr("y", y).attr("href", src)
        .attr("width", w1).attr("height", h1).attr("id", id);
    else
        d3.select("svg").append("image").attr("x", x).attr("y", y)
        .attr("width", w1).attr("height", h1).attr("href", src);
//    console.log(cash);
    return {w: w1, h:h1};
}
let ids = [];

image(30, 30, "data/images/kolymaga2_ship.png").then( () =>{


for (var x=xs; x< window.screen.width; x+=30){
    line(x, 0, x, window.screen.height, "black");
}

for (var y=ys; y< window.screen.height; y+=30){
    line(0, y, window.screen.width, y, "black");
}



async function load_parts() {
for (name of ["Armor", "Engine", "Reactor", "MachineGun"]) {
    let res;
    let m = 0;
    for (i=0; m<8; i++){
        res = await image(xs+(15+m)*30, ys+n*30, "data/images/"+name+"_ship.png", name + i);
        ids.push(name+i);
        m += res.w/30;
    }
    n += res.h/30;
}}

load_parts();});

//for (name of ["Armor", "Engine", "Reactor", "MachineGun"]) {
//    let m = 0;
//    res = image(xs+(15+m)*30, ys+n*30, "data/images/"+name+"_ship.png", name);
//    ids.push(name);
//    m += 3;
//    n += 3;
//}



let x_click=-1;
let y_click=-1;
var gid = '';

function getOffset(element)
{
    var bound = element.getBoundingClientRect();
    var html = document.documentElement;

    return {
        top: bound.top + window.pageYOffset - html.clientTop,
        left: bound.left + window.pageXOffset - html.clientLeft
    };
}

let k=1;

function click(event){
    if (gid != '' && event.button != 2)
    {
        var el = d3.select("#"+gid);
        if ((parseInt(el.attr("x"))-xs) / 30 < 15){
            let x = Math.floor((parseInt(el.attr("x"))-xs) / 30);
            let y = Math.floor((parseInt(el.attr("y"))-ys) / 30);
            let ang = el.attr("transform");
            if (ang){
                ang = parseInt(ang.split("(")[1]);
            }
            else
                ang = 0;
            wd = parseInt(el.attr("width"))/30;
            ht = parseInt(el.attr("height"))/30;
            if (ang % 180 == 90) {
                wd = parseInt(el.attr("height"))/30;
                ht = parseInt(el.attr("width"))/30;
                x = x -wd/2+ht/2;
                y = y+wd/2-ht/2;
            }
            if (x<1 || y < 1 || x > ln || y> dl){
                audio.play();
                return;
            }
            x -= 1;
            y -= 1;

            let cop = matrix;

            for (let w=x; w<x+wd; w++){
                if (w >= ln) {
                    audio.play();
                    matrix = cop;
                    return;
                }
                for (let h=y; h<y+ht; h++){
                    let c = h * ln + w;
                    console.log(c);
                    if (h >= dl) {
                        audio.play();
                        matrix = cop;
                        return;
                    }
                    if (matrix[c] != "X"){
                        audio.play();
                        matrix = cop;
                        return;
                    }
                    else {matrix = matrix.slice(0, c) + " "+ matrix.slice(c+1);}
                }
            }
            console.log(cop);
            console.log(matrix);
        }
        gid ='';
        return;
    }

    for (el of d3.selectAll("image")) {
        if (ids.includes(el.id)) {
            let w, h;
            offset = getOffset(el);
            k = field.width.baseVal.value / window.screen.width;
            let d3el = d3.select("#"+el.id);
            let ang = d3el.attr("transform");
            if (ang){
                ang = parseInt(ang.split("(")[1]);
            }
            else
                ang = 0;
            if (ang % 180 != 90){
                w = el.width.baseVal.value*k;
                h = el.height.baseVal.value*k;
            }
            else {
                w = el.height.baseVal.value*k;
                h = el.width.baseVal.value*k;
            }
            x_click = event.clientX-offset.left;
            y_click = event.clientY-offset.top;

            if (0 < x_click && x_click < w && 0 < y_click  && y_click < h) {
                if (ang % 180 == 90){
                    x_click += -w/2+h/2;
                    y_click += w/2-h/2;
                }

                gid = el.id;
//                x_click = event.clientX;
//                y_click = event.clientY;
                let x = Math.floor((parseInt(d3el.attr("x"))-xs) / 30);
                let y = Math.floor((parseInt(d3el.attr("y"))-ys) / 30);


                wd = parseInt(d3el.attr("width"))/30;
                ht = parseInt(d3el.attr("height"))/30;


                ang = d3el.attr("transform");
                if (ang){
                    ang = parseInt(ang.split("(")[1]);
                }
                else
                    ang = 0;

                if (ang % 180 == 90) {

                    wd = parseInt(d3el.attr("height"))/30;
                    ht = parseInt(d3el.attr("width"))/30;
                    x = x -wd/2+ht/2;
                    y = y+wd/2-ht/2;
                }

                if (!(x<1 || y < 1 || x > ln || y> dl)){
                    x -= 1;
                    y -= 1;


                    let cop = matrix;

                    for (let w=x; w<ln && w<x+wd; w++){
                        for (let h=y; h<dl && h<y+ht; h++){
                            let c = h * ln + w;
                            matrix = matrix.slice(0, c) + "X"+ matrix.slice(c+1);
                        }
                    }
                    console.log(matrix);
                }

                if (event.button == 0){
//                    gid = el.id;
;
                }
                else if (event.button == 2){
                    ang += 90;
                    ang %= 360;
                    d3el.attr("transform", "rotate("+ang+"," + (el.x.baseVal.value+el.width.baseVal.value/2) + ", " + (el.y.baseVal.value+el.height.baseVal.value/2) + ")");
                    }
                return;
            }
        }
    }

}


function move(event) {
    if (gid != '') {
        var el = d3.select("#"+gid);
        let ang = el.attr("transform");
        if (ang){
            ang = parseInt(ang.split("(")[1]);
        }
        else
            ang = 0;

        el.attr("x", Math.floor((event.clientX-x_click)/30/k)*30+xs)
        .attr("y",  Math.floor((event.clientY-y_click)/30/k)*30+ys)
        .attr("transform", "rotate("+ang+"," + (parseInt(el.attr("x"))+parseInt(el.attr("width"))/2) + ", " + (parseInt(el.attr("y"))+parseInt(el.attr("height"))/2) + ")");
//        d3.select("#"+gid).attr("transform", "translate("+Math.floor((event.clientX-x_click)/30/k)*30+", "+Math.floor((event.clientY-y_click)/30/k)*30+")");
    }
}

console.log(ids);
document.body.addEventListener("click", click);
document.body.addEventListener("mousemove", move);
document.body.addEventListener('contextmenu', function(event) {
  // Отменяем стандартное поведение браузера (не показываем системное контекстное меню)
  event.preventDefault();

  // Здесь можно добавить свой код: показать своё меню, вывести сообщение и т.д.
  click(event);
});
