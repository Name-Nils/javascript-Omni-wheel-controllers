// this file is for handling the received data from the websocket (camera and lidar data needs to be split and camera data pushed into a img element)

loadScript("./javascript/helper_funcs.js");
loadScript("./javascript/lidar.js");
loadScript("./javascript/video.js");
loadScript("./javascript/main.js");

let camera_stream = document.getElementById("camera_stream");

receive_event.addEventListener("click", function()
{
    // this will be run when new data is presen
    let data = receive_data.pop();

    // these functions will send the data to the respective functions to handle the data and process it
    if (check("cam", data))
    {
        let base_64 = command(" ", "", data);

        console.log(settings.CAMERA);
        show_live_camera(settings.CAMERA, base_64);
    }
    else if (check("lidar", data))
    {
        let lidar_data = command(" ", "", data);
        let data_set = new Set(lidar_data);

        visualize_lidar_radar(settings.LIDAR, 0.05, data_set, true); // zoom is inversed, 0.1 is multiplied by the coordinates instead of divided by.
    }
})
