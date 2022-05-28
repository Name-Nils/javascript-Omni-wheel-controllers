active = false;
connected = false;

x = 0;
y = 0;

let screenLog = document.querySelector('#screen-log');
document.addEventListener('mousemove', logKey);


let d = new Date();
let time = d.getTime();
let time_per = 100;
function logKey(e) {
    d = new Date();
    if (time + time_per > d.getTime())
    {
        return;
    }
    time = d.getTime();

    //console.log(indx);

    x = ((e.clientX / window.innerWidth) - 0.5) * 2;
    y = ((e.clientY / window.innerHeight) - 0.5) * 2

    screenLog.innerText = `window size: ${window.innerWidth}, ${window.innerHeight}
    Client X/Y: ${e.clientX}, ${e.clientY}
    
    time: ${time}

    percentage: ${x}, ${y}
    Motor state: ${active}
    Socket connection: ${connected}`;


    size = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    angle = Math.atan2(x, y);


    if (active) {

        send(angle, size * 200, 0);

    }

}

window.addEventListener("load", logKey);

window.addEventListener("mousedown", change_state);
last_state = active;
function change_state(e) {
    active = !active;

    if (!active) {
        ws.send("A0 S0 R0");
        logKey(e);
    }
    else {
        logKey(e);
    }

}



const ws = new WebSocket("ws://192.168.8.117:8080");



ws.addEventListener("open", () => {
    console.log("we are conencted");
    connected = true;
})
ws.addEventListener("close", () => {
    console.log("disconnected");
    connected = false;
    refresh();
})


ws.onmessage = function(event)
{
    console.log(event.data);
    img_data = "data:image/png;base64," + String(event.data).substring(2, String(event.data).length - 1)
    document.getElementById("img_stream").src= img_data;
}


send = function (A, S, R) {
    //console.log("A" + String(A) + " S" + String(S) + " R" + String(R));
    if (active) {
        ws.send("A" + String(A - (Math.PI / 2)) + " S" + String(S) + " R" + String(R));
    }
}


refresh = function () {
    if (!connected) {
        window.location = window.location.href;
    }
}
//setInterval(refresh, 4000);