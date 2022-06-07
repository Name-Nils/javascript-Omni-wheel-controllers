const ws = new WebSocket("ws://192.168.8.117:8080");


let receive_data = []
let receive_event = document.createElement("box");
receive_event.textContent = "";

let send_queue = []
const send_per_time = 2;
const time_between_sends = 200; // milliseconds

const Socket = {
    CLOSED: 0,
    OPEN: 1
}

let socket_state = Socket.CLOSED;

ws.onmessage = function(event)
{
    receive_data.push(event.data);
    receive_event.click();
}

ws.onopen = function()
{
    socket_state = Socket.OPEN;
}

ws.onclose = function()
{
    socket_state = Socket.CLOSED;
}   

let send_data = function()
{
    receive_event.click();
    if (socket_state == Socket.CLOSED) return;
    
    if (send_queue.length > 0)
    {
        for (let i = 0;  i < send_per_time; i++)
        {
            if (send_queue.length == 0) break;
            ws.send(send_queue.pop());
        }
    }
    else
    {
        ws.send(" "); // send something to break other side wait for receive so that we can receive camera input and lidar data
    }
}

setInterval(send_data, time_between_sends);