const ws = new WebSocket("ws://192.168.8.117:8080");


let receive_data = []
let send_queue = []

const Socket_state = {
    CLOSED: 0,
    OPEN: 1
}

state = CLOSED;

ws.onmessage = function(event)
{
    receive_data.push(event.data);
}

ws.onopen = function()
{
    state = OPEN;
}

ws.onclose = function()
{
    state = CLOSED;
}   