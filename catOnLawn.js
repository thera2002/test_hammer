"use strict";

let elms = [];
let isMoving = [];
let wImg = 0;
let hImg = 0;


function hammerEventToPosition(posx, posy) {
    const theLawn = document.getElementById("theLawn");
    let x = posx - theLawn.offsetLeft - theLawn.clientLeft;
    let y = posy - theLawn.offsetTop - theLawn.clientTop;

    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }

    if (x + wImg > theLawn.clientWidth) {
        x = theLawn.clientWidth - wImg;
    }

    if (y + hImg > theLawn.clientHeight) {
        y = theLawn.clientHeight - hImg;
    }

    return {
        x: x,
        y: y
    };

}

function isInsideRect(x, y, rect) {
    const lt = hammerEventToPosition(rect.left, rect.top);
    const rb = { x: lt.x + wImg, y: lt.y + hImg };
    if (x >= lt.x && x < rb.x && y >= lt.y && y < rb.y) {
        return true;
    }
    return false;
}

function panStart(e, x, y, scale) {
    console.log("PAN START: ", x, y);
    for (let i = 0; i < elms.length; i++) {
        const rect = elms[i].getBoundingClientRect();
        if (isInsideRect(x, y, rect)) {
            isMoving[i] = true;
            return;
        };
    }
}

function panMove(e, x, y, scale) {
    console.log("PAN MOVE: ", x, y);
    for (let i = 0; i < elms.length; i++) {
        if(isMoving[i]) {
            console.log("MOVING " + i);
        }
    }
}

function panEnd(e, x, y, scale) {
    console.log("PAN END: ", x, y);
    isMoving[0] = false;
    isMoving[1] = false;   
}

function singleTap(e, x, y, scale) {
    console.log("SINGLE TAP: ", x, y);
    const rect1 = elms[0].getBoundingClientRect();
    if (isInsideRect(x, y, rect1)) {
        console.log("INSIDE CAT 1")
    }
    const rect2 = elms[1].getBoundingClientRect();
    if (isInsideRect(x, y, rect2)) {
        console.log("INSIDE CAT 2")
    }
}

function processEvent(callback, e, x, y, scale) {
    if (window[callback]) {
        const f = window[callback];
        f(e, x, y, scale);
    }
}


function initEvents() {
    const theLawn = document.getElementById("theLawn");

    const mc = new Hammer.Manager(theLawn);

    mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    mc.add(new Hammer.Tap({ event: 'singletap', taps: 1 }));
    mc.get('doubletap').recognizeWith('singletap');
    mc.get('singletap').requireFailure('doubletap');
    mc.add(new Hammer.Pan({ pointers: 1, direction: Hammer.DIRECTION_ALL, threshold: 0 }));
    mc.add(new Hammer.Pinch());

    let events = {
        'singletap': 'singleTap', 'doubletap': 'doubleTap',
        'panstart': 'panStart', 'panmove': 'panMove', 'panend pancancel': 'panEnd',
        'pinchstart': 'pinchStart', 'pinchmove': 'pinchMove', 'pinchend pinchcancel': 'pinchEnd'
    };
    for (let [event, callback] of Object.entries(events)) {
        mc.on(event, (e) => {
            const pos = hammerEventToPosition(e.center.x, e.center.y);
            const scale = e.scale;
            processEvent(callback, e, pos.x, pos.y, scale);
            e.preventDefault();
            return false;
        });
    }

}

function main() {
    const theLawn = document.getElementById("theLawn");
    const theCat1 = document.getElementById("theCat1");
    const theCat2 = document.getElementById("theCat2");
    wImg = theCat1.width;
    hImg = theCat1.height;
    elms.push(theCat1);
    elms.push(theCat2);
    isMoving[0] = false;
    isMoving[1] = false;

    //TouchEmulator();
    // const theLawnGM = new Hammer(theLawn, {
    //     inputClass: Hammer.TouchMouseInput
    // });

    initEvents();

    document.addEventListener("keydown", (evt) => {
        if (evt.code == "Space") {
            theCat1.style.left = 0 + "px";
            theCat1.style.top = 0 + "px";
            theCat2.style.right = 0 + "px";
            theCat2.style.top = 0 + "px";
        }
    });

}