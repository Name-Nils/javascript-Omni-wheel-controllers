

show_live_camera = function(show, base64_string)
{
    let img = document.getElementById("camera_stream");
    if (!show)
    {
        img.style.display = "none";
    }
    else
    {
        img.style.display = "block";
    }

    let image_data = "data:image/png;base64,";

    image_data += base64_string;
    
    img.src = image_data;
}