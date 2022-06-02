

class Key
{
    constructor(keycode)
    {
        this.keycode = keycode;
        
        this.data = 0;
    }

    clicked = function()
    {
        this.data = 1;
    }
    released = function()
    {
        this.data = 0;
    }
}

class Keyboard
{
    keys = [];
    constructor(){}

    clicked = function(keycode)
    {
        for (let i = 0; i < this.keys.length; i++)
        {
            if (keycode == this.keys[i].keycode)
            {
                this.keys[i].data = 1;
            }
        }
    }
    released = function(keycode)
    {
        for (let i = 0; i < this.keys.length; i++)
        {
            if (keycode == this.keys[i].keycode)
            {
                this.keys[i].data = 0;
            }
        }
    }
}

const key_enum = {
    ArrowRight: 0,
    ArrowLeft: 1,
    ArrowUp: 2,
    ArrowDown: 3,
    w: 4,
    s: 5,
    a: 6,
    d: 7
};

let keyboard = new Keyboard();
keyboard.keys.push(new Key("ArrowRight"));
keyboard.keys.push(new Key("ArrowLeft"));
keyboard.keys.push(new Key("ArrowUp"));
keyboard.keys.push(new Key("ArrowDown"));
keyboard.keys.push(new Key("w"));
keyboard.keys.push(new Key("s"));
keyboard.keys.push(new Key("a"));
keyboard.keys.push(new Key("d"));


document.addEventListener("keydown", function(event)
{
    keyboard.clicked(event.key);
    run_move();
})
document.addEventListener("keyup", function(event)
{
    keyboard.released(event.key);
    run_move();
})


let last_cam_send;
let last_move_send;
car_movement = function()
{

}

let last_camera_omni_movement = 0;
omni_movement = function()
{
    let x = keyboard.keys[key_enum.ArrowRight].data - keyboard.keys[key_enum.ArrowLeft].data;
    let y = keyboard.keys[key_enum.ArrowUp].data - keyboard.keys[key_enum.ArrowDown].data;
    let rotation = keyboard.keys[key_enum.a].data - keyboard.keys[key_enum.d].data; // has been reversed so that the correct rotation is made

    let angle = Math.atan2(y, x);
    let speed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    rotation = rotation * 0.8;

    let send = "move A";
    send += String(angle);
    send += "S";
    send += String(speed * 200);
    send += "R";
    send += String(rotation);
    
    let camera = keyboard.keys[key_enum.w].data - keyboard.keys[key_enum.s].data;
    let cam_send = "camA" + String(camera * 5);
    
    if (send != last_move_send)
    {
        send_queue.push(send);
    }
    if (cam_send != last_cam_send)
    {
        send_queue.push(cam_send);
    }
    last_move_send = send;
    last_cam_send = cam_send;
}

text_movement = function()
{

}

run_move = function()
{
    if (!settings.MOTION) return;
    omni_movement();
}