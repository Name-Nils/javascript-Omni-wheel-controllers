import tkinter
from tkinter import Button, Canvas, filedialog as fd

from pyparsing import col

root = tkinter.Tk()
canvas_size = 500

file_dir = ""

def select_file():
    global file_dir

    filetypes = (
        ('text files', '*.txt'),
        ('All files', '*.*')
    )

    file_dir = fd.askopenfilename(
        title='Open a file',
        initialdir='/Users/%username%/downloads',
        filetypes=filetypes)
    update_canvas(0.95, 0.08, False)


file_button = tkinter.Button(root, text="File Select", command=select_file).pack()
visualize = tkinter.Canvas(root, width=canvas_size, height=canvas_size)
visualize.pack()

def rgb(r,g,b):
    return f'#{r:02x}{g:02x}{b:02x}'

def update_canvas(min_percent, zoom, color_dependency):
    file = open(file_dir, "r")
    data = file.readlines()

    for point in data:
        if (point[:1] != "X"):
            continue

        point = point.split(" ")
        x = float(point[0][1:]) * zoom
        y = float(point[1][1:]) * zoom
        percent = float(point[2][1:])

        if (min_percent > percent): continue

        color = 0
        if (color_dependency):
            color = 255 - round(((percent - min_percent) / (1-min_percent)) * 255)
        visualize.create_rectangle((x + (canvas_size / 2),y + (canvas_size / 2))*2, outline=rgb(color,color,color))

root.mainloop()