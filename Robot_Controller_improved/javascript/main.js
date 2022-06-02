let settings = {
    CAMERA: true,
    LIDAR: true,
    MOTION: true,
    AUTONOMY: false
};

let camera_element = document.getElementById("setting_camera");

camera_element.addEventListener("click", function()
{
    settings.CAMERA = camera_element.checked;
})

let lidar_element = document.getElementById("setting_lidar");

lidar_element.addEventListener("click", function()
{
    settings.LIDAR = lidar_element.checked;
})