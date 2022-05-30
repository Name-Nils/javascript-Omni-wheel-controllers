
connected = false;
let socket_queue = [];
let allow_forward = true;
let allow_backward = true;
let safe_dist = 40;
let checking_angle = 50;

class key {
    constructor(key, func) {
        this.func = func;
        this.key = key;

        let state = false;
    }
}

let cam_angle = 90;
let cam_up = new key("w", function () {
    cam_angle += 5;
})
let cam_down = new key("s", function () {
    cam_angle -= 5;
})

let rotation = 0;
let movement = 0;
let right = new key("ArrowRight", function () {
    rotation = 1;
})
let left = new key("ArrowLeft", function () {
    rotation = -1;
})
let forward = new key("ArrowUp", function () {
    if (allow_forward) {
        movement = 1;
    }
    else {
        movement = 0;
    }
})
let backward = new key("ArrowDown", function () {
    if (allow_backward) {
        movement = -1;
    }
    else {
        movement = 0;
    }
})

document.addEventListener("keydown", function (event) {
    if (cam_up.key == event.key) cam_up.func();
    if (cam_down.key == event.key) cam_down.func();

    if (right.key == event.key) right.func();
    if (left.key == event.key) left.func();
    if (forward.key == event.key) forward.func();
    if (backward.key == event.key) backward.func();

    if (movement == Math.abs(movement)) {
        send_movement(Math.PI, Math.abs(movement * 200), -rotation * 0.8);
    } else {
        send_movement(0, Math.abs(movement * 200), -rotation * 0.8);
    }
    send_camera(cam_angle);
})
document.addEventListener("keyup", function (event) {
    if ((right.key == event.key) || (left.key == event.key)) {
        rotation = 0;
    }
    if ((forward.key == event.key) || (backward.key == event.key)) {
        movement = 0;
    }
    send_movement(0, movement * 200, rotation * 0.8);
    send_camera(cam_angle);
})


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

class points
{
    constructor(angle, distance, accuracy)
    {
        this.angle = angle;
        
        this.distance = distance;
        this.accuracy = accuracy;

        this.x = 0;
        this.y = 0;
    }
    
    calc_xy = function()
    {
        this.x = Math.cos((Math.PI / 180) * this.angle) * this.distance;
        this.y = Math.sin((Math.PI / 180) * this.angle) * this.distance;
    }

    get_data = function()
    {
        return String(
            "X" + String(this.x) +
            " Y" + String(this.y) + 
            " P" + String(this.accuracy)
        );
    }
}

let lidar = [];
let last_data = [];
visualize_lidar = function (string) { // 32 cm diameter robot
    string_ = string.substring(6, string.length); // remove the beginning id and the ending }, not necessary anymore since the splitting method removes these parts now anyway
    let data = string_.split(", ");


    let c = document.getElementById("lidar");
    let w = c.width;
    let h = c.height;


    let canvas = c.getContext("2d");
    canvas.lineWidth = 1;
    canvas.strokeStyle = "black";
    canvas.clearRect(0, 0, w, h);
    canvas.beginPath();

    canvas.moveTo(w / 2, h / 2);
    canvas.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    canvas.fillStyle = "rgba(255, 255, 255, 0.5)";
    canvas.fill();

    canvas.beginPath();
    canvas.arc(w / 2, h / 2, safe_dist, 0, Math.PI * 2);
    canvas.stroke();
    canvas.beginPath();


    allow_backward = true;
    allow_forward = true;
    for (let i = 0; i < 360; i++) {
        let dist = data[i] / 10;

        let diff = Math.abs(last_data[i] - dist);

        const min_sure = 30;
        let current = 0;
        if (diff <= min_sure)
        {
            current = 1- (diff / min_sure);
        }
        lidar[i] = new points(i, dist * 10, current);
        // fixing the data, removing the noise

        canvas.fillStyle = "rgba(0, 0, 0, 0)";
        let gradient_max = 20;
        if (diff < gradient_max)
        {
            canvas.fillStyle = "rgba(0, 0, 0, " + String((gradient_max - diff) / gradient_max) + ")";
        }
    
        if (diff < 1)
        {
            canvas.fillStyle = "green";
        }
        last_data[i] = dist;


        if (dist > w / 2) continue;//dist = w/2;
        if (dist != 0) {
            last_data[i] = dist;
        }
        else {
            dist = last_data[i];
        }


        canvas.moveTo(w / 2, h / 2);
        let x = (Math.cos(Math.PI / 180 * (i + 90)) * dist) + w / 2;
        let y = (Math.sin(Math.PI / 180 * (i + 90)) * dist) + w / 2;
        //canvas.lineTo(x,y);
        canvas.fillRect(x - 1, y - 1, 2, 2);
        //canvas.stroke();
    }
    canvas.moveTo(w / 2, h / 2);
    canvas.arc(w / 2, h / 2, 32 / 2, 0, Math.PI * 2);
    canvas.fillStyle = "red";
    canvas.fill();
}
//visualize_lidar("lidar {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 164, 11: 530, 12: 518, 13: 1073, 14: 1387, 15: 1557, 16: 1993, 17: 2058, 18: 2101, 19: 2089, 20: 2078, 21: 2069, 22: 2062, 23: 2056, 24: 2051, 25: 2046, 26: 2041, 27: 2036, 28: 2034, 29: 2033, 30: 2030, 31: 2029, 32: 2029, 33: 2027, 34: 2028, 35: 2030, 36: 2031, 37: 2041, 38: 2061, 39: 2066, 40: 2071, 41: 2078, 42: 2082, 43: 2095, 44: 2160, 45: 2109, 46: 1915, 47: 1912, 48: 1921, 49: 1930, 50: 1943, 51: 1952, 52: 1964, 53: 1978, 54: 1991, 55: 2006, 56: 2022, 57: 2039, 58: 2058, 59: 2077, 60: 2097, 61: 2118, 62: 2136, 63: 2159, 64: 543, 65: 462, 66: 423, 67: 603, 68: 594, 69: 591, 70: 578, 71: 569, 72: 564, 73: 560, 74: 557, 75: 553, 76: 546, 77: 542, 78: 537, 79: 532, 80: 517, 81: 483, 82: 489, 83: 495, 84: 496, 85: 502, 86: 500, 87: 490, 88: 161, 89: 351, 90: 342, 91: 338, 92: 334, 93: 331, 94: 329, 95: 329, 96: 329, 97: 329, 98: 329, 99: 334, 100: 331, 101: 335, 102: 342, 103: 348, 104: 141, 105: 0, 106: 164, 107: 499, 108: 140, 109: 0, 110: 0, 111: 415, 112: 1630, 113: 1603, 114: 2472, 115: 1838, 116: 2112, 117: 2113, 118: 2607, 119: 2604, 120: 2279, 121: 2648, 122: 2605, 123: 2527, 124: 2527, 125: 2508, 126: 2527, 127: 2527, 128: 2473, 129: 2477, 130: 2517, 131: 2745, 132: 2754, 133: 2764, 134: 2772, 135: 2781, 136: 2792, 137: 2786, 138: 2763, 139: 2655, 140: 2641, 141: 2679, 142: 2771, 143: 2794, 144: 2777, 145: 2766, 146: 2776, 147: 2792, 148: 2809, 149: 2837, 150: 2863, 151: 2864, 152: 2883, 153: 2900, 154: 2916, 155: 2931, 156: 2955, 157: 3021, 158: 3032, 159: 2957, 160: 2887, 161: 2822, 162: 2768, 163: 2711, 164: 2656, 165: 2604, 166: 2554, 167: 2515, 168: 2479, 169: 2436, 170: 2397, 171: 2360, 172: 2322, 173: 2287, 174: 2255, 175: 2224, 176: 2197, 177: 2170, 178: 2147, 179: 2122, 180: 2098, 181: 2073, 182: 2054, 183: 2036, 184: 2017, 185: 1998, 186: 1980, 187: 1964, 188: 1952, 189: 1938, 190: 1923, 191: 1910, 192: 1898, 193: 1886, 194: 1875, 195: 1864, 196: 1853, 197: 1845, 198: 1837, 199: 1828, 200: 1820, 201: 1814, 202: 1809, 203: 1804, 204: 1800, 205: 1795, 206: 1791, 207: 1789, 208: 1787, 209: 1786, 210: 1785, 211: 1783, 212: 1783, 213: 1785, 214: 1786, 215: 1195, 216: 766, 217: 511, 218: 0, 219: 0, 220: 0, 221: 0, 222: 0, 223: 0, 224: 0, 225: 0, 226: 0, 227: 0, 228: 0, 229: 0, 230: 0, 231: 0, 232: 0, 233: 0, 234: 0, 235: 0, 236: 0, 237: 0, 238: 0, 239: 0, 240: 0, 241: 0, 242: 0, 243: 0, 244: 0, 245: 0, 246: 0, 247: 0, 248: 0, 249: 0, 250: 0, 251: 0, 252: 0, 253: 0, 254: 0, 255: 0, 256: 0, 257: 0, 258: 0, 259: 0, 260: 0, 261: 0, 262: 0, 263: 0, 264: 0, 265: 21, 266: 169, 267: 211, 268: 211, 269: 212, 270: 212, 271: 212, 272: 212, 273: 213, 274: 142, 275: 26, 276: 0, 277: 0, 278: 0, 279: 0, 280: 0, 281: 0, 282: 0, 283: 0, 284: 0, 285: 0, 286: 0, 287: 0, 288: 0, 289: 0, 290: 0, 291: 0, 292: 0, 293: 0, 294: 0, 295: 0, 296: 0, 297: 0, 298: 0, 299: 0, 300: 0, 301: 0, 302: 0, 303: 0, 304: 0, 305: 0, 306: 0, 307: 0, 308: 0, 309: 0, 310: 0, 311: 0, 312: 0, 313: 0, 314: 0, 315: 0, 316: 0, 317: 0, 318: 0, 319: 0, 320: 0, 321: 0, 322: 0, 323: 0, 324: 0, 325: 0, 326: 0, 327: 0, 328: 0, 329: 0, 330: 0, 331: 0, 332: 0, 333: 0, 334: 0, 335: 0, 336: 0, 337: 0, 338: 0, 339: 0, 340: 0, 341: 0, 342: 0, 343: 0, 344: 0, 345: 0, 346: 0, 347: 0, 348: 0, 349: 0, 350: 0, 351: 0, 352: 0, 353: 0, 354: 0, 355: 0, 356: 0, 357: 0, 358: 0, 359: 0}");

ws.onmessage = function (event) {
    //console.log(event.data);
    if (String(event.data).substring(0, 5) == "lidar") {
        visualize_lidar(event.data);
    }

    if (String(event.data).substring(0, 3) != "img") return;
    img_data = "data:image/png;base64," + String(event.data).substring(4, String(event.data).length)
    document.getElementById("img_stream").src = img_data;
}


let last_movement_string = "";
send_movement = function (A, S, R) {
    //console.log("A" + String(A) + " S" + String(S) + " R" + String(R));
    if (connected) {
        send = "A" + String(A - (Math.PI / 2)) + " S" + String(S) + " R" + String(R);
        if (last_movement_string == send) return;
        //console.log(send);
        socket_queue.push(String(send));
        last_movement_string = send;
    }
}

let last_cam_angle = cam_angle;
send_camera = function (a) {
    if (last_cam_angle == a || !connected) return;

    console.log("cam A" + String(a));
    let send_item = String("cam A" + String(a));
    socket_queue.push(send_item);
    last_cam_angle = a;
}

get_image = function () {
    if (!connected) return;
    console.log(socket_queue.length);
    if (socket_queue.length == 0) {
        ws.send(" ");
    }
    else {
        ws.send(socket_queue.pop());
    }
    if (socket_queue.length > 10)
    {
        alert("Command overflow\nQueue size: " + String(socket_queue.length));
    }
}
setInterval(get_image, 50);

refresh = function () {
    if (!connected) {
        window.location = window.location.href;
    }
}
//setInterval(refresh, 4000);

function save_lidar()
{
    //if (!connected) alert("Not Connected to Robot"); return;
    let d = new Date();
    let data = "Lidar data points\nTime recoreded: " + String(d.getTime());
    for (let i = 0; i < 360; i++)
    {
        lidar[i].calc_xy();
        data += "\n" + lidar[i].get_data();
    }

    const textToBLOB = new Blob([data], { type: 'text/plain' });
    let sFileName = "Lidar Data " + String(d.getTime()) + ".txt";
    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }

    newLink.click(); 
}