
loadScript("./javascript/helper_funcs.js")

class Point
{
    // as long as the points havent been translated, 0,0 will be the robots posisiton
    constructor(x, y, acc = 1)
    {
        this.acc = acc;
        this.x = x;
        this.y = y;
    }
}
class Set
{
    points = [];

    constructor(point_data)
    {
        if (typeof point_data == "string")
        {
            // this is where the raw data is converted to Point data
            let split_data = point_data.split(",");
            for (let i = 0; i < split_data.length; i++) // there should always be 360 points although some will be less accurate
            {
                let x = command("X", "YP ", split_data[i]);
                let y = command("Y", "P ", split_data[i]);
                let p = command("P", "", split_data[i]);
                this.points.push(new Point(x, y, p));
            }
        }
        else if (typeof point_data == "object")
        {
            this.points = [...point_data];
        }
    }

    // add functions for potential removal of lesser points (low acc value)

    return_transformed = function(x, y, r, z = 1)
    {
        let transformed = [];
        for (let i = 0; i < this.points.length; i++)
        {
            transformed.push(new Point( // using the 2d rotation matrix to rotate and then adding the offset after the fact
                (((this.points[i].x * Math.cos(r)) - (this.points[i].y * Math.sin(r))) + x) * z,
                (((this.points[i].x * Math.sin(r)) + (this.points[i].y * Math.cos(r))) + y) * z,
                this.points[i].acc
            ));
        }
        return new Set(transformed);
    }
    transform = function(x, y, r, z = 1)
    {
        let temp = new Set(this.points);
        let new_points = temp.return_transformed(x, y, r, z);
        this.points = [...new_points.points];
    }
}

visualize_lidar_radar = function(show, zoom, data_set, circle=true)
{
    let element = document.getElementById("visualize_lidar");
    if (!show) 
    {
        element.style.display = "none";
        return;
    }
    else
    {
        element.style.display = "block";
    }
    
    let width = element.width;
    let height = element.height;
    let canvas = element.getContext("2d");
    
    let zoomed_data = data_set.return_transformed(width / zoom / 2, height / zoom / 2, 0, zoom); 
    // begin with clearing old things off canvas
    canvas.clearRect(0,0,width,height);
    canvas.beginPath();

    canvas.fillStyle = "rgba(0,0,0,0.2)";
    if (circle)
    {            
        let smallest = (width > height) ? height : width;
        canvas.arc(width/2, height/2, smallest/2, 0, Math.PI * 2);
    }
    else
    {
        canvas.fillRect(0,0,width, height);    
    }
    canvas.fill();
    canvas.beginPath();
    
    for (let i = 0; i < zoomed_data.points.length; i++)
    {        
        if (circle)
        {
            let temp = data_set.return_transformed(0,0,0,zoom);
            let smallest = (width > height) ? height : width;
            if (Math.sqrt(Math.pow(temp.points[i].x, 2) + Math.pow(temp.points[i].y, 2)) > smallest / 2)
            {
                continue;
            }
        }

        let x = Math.round(zoomed_data.points[i].x);
        let y = Math.round(zoomed_data.points[i].y);

        canvas.fillStyle = "rgba(0,0,0,1)"; // should fill with black
        canvas.fillRect(x - 1, y - 1, 2, 2);
    }
    canvas.moveTo(width/2, height/2);
    canvas.arc(width/2, height/2, (320/2) * zoom, 0, Math.PI * 2); // robot is ~ 320mm in diameter
    canvas.fillStyle = "rgba(255,0,0,1)";
    canvas.fill();
}