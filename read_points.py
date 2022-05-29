import math
import tkinter
from tkinter import Button, Canvas, filedialog as fd
from pyparsing import col


class Point:
    x = 0
    y = 0
    acc = 0
    show = True

    def __init__(self, x, y, acc, show=True) -> None:
        self.x = x
        self.y = y
        self.acc = acc
        self.show = show


class Set:
    points = []

    def __init__(self, file_dir) -> None:
        file = open(file_dir, "r")
        data = file.readlines()

        for point in data:
            if (point[:1] != "X"):
                continue

            point = point.split(" ")
            self.points.append(
                Point(float(point[0][1:]), float(point[1][1:]),
                      float(point[2][1:])))

    def dist(self, a, b):
        return math.sqrt(math.pow(a.x - b.x, 2) + math.pow(a.y - b.y, 2))

    def remove_noise(self):
        min_dist = 50
        amount_close = 1

        for point in self.points:
            if point.acc < 0.95:
                point.show = False

        for point in self.points:
            if point.show == False: continue

            set_point = 0
            for check in self.points:
                if check.show == False: continue

                if (point.x == check.x and point.y == check.y): continue

                if (self.dist(point, check) < min_dist):
                    set_point += 1
            if (set_point < amount_close):
                point.show = False


root = tkinter.Tk()
canvas_size = 500

file_dir = ""


def select_file():
    global file_dir

    filetypes = (('text files', '*.txt'), ('All files', '*.*'))

    file_dir = fd.askopenfilename(title='Open a file',
                                  initialdir='/Users/%username%/downloads',
                                  filetypes=filetypes)
    update_canvas(0.9, 0.14)


file_button = tkinter.Button(root, text="File Select",
                             command=select_file).pack()
visualize = tkinter.Canvas(root, width=canvas_size, height=canvas_size)
visualize.pack()


def rgb(r, g, b):
    return f'#{r:02x}{g:02x}{b:02x}'


def create_circle(x, y, r, canvasName, color):  #center coordinates, radius
    x0 = x - r
    y0 = y - r
    x1 = x + r
    y1 = y + r
    return canvasName.create_oval(x0, y0, x1, y1, fill=color)


def update_canvas(min_percent, zoom):
    data = Set(file_dir)
    data.remove_noise()

    for i in data.points:
        if (min_percent > i.acc): continue
        if (i.show != True): continue
        visualize.create_rectangle(
            (i.x * zoom + (canvas_size / 2), i.y * zoom +
             (canvas_size / 2)) * 2,
            outline="black")


root.mainloop()