command = function(token, splitter, string)
{
    let start = string.indexOf(token) + token.length;

    let end = string.substring(start, string.length).length;
    for (let i = 0; i < splitter.length; i++)
    {
        try
        {
            let temp = string.substring(start, string.length).indexOf(splitter[i]);
            if (temp < end) end = temp;
        }
        catch{}
    }
    return string.substring(start, end + start);
}

check = function(token, string)
{
    try
    {
        if (string.indexOf(token) == 0) return true;
        return false;
    }
    catch
    {
        return false;
    }
}
