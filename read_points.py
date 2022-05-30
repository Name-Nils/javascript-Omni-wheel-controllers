import math
import tkinter
from tkinter import Button, Canvas, filedialog as fd
from numpy import angle, diff, short
from pyparsing import col


class Point:
    def __init__(self, x, y, acc=1, show=True) -> None:
        self.x = x
        self.y = y
        self.acc = acc
        self.show = show


class Set:

    def __init__(self, file_dir) -> None:
        self.points = []
        file = open(file_dir, "r")
        data = file.readlines()

        for point in data:
            if (point[:1] != "X"):
                continue

            point = point.split(" ")
            self.points.append(
                Point(float(point[0][1:]), float(point[1][1:]),
                      float(point[2][1:])))

    def translate(self, x, y, r=0):
        for point in self.points:
            new_x = (point.x * math.cos(r)) - (point.y * math.sin(r))
            new_y = (point.x * math.sin(r)) + (point.y * math.cos(r))
            
            point.x = new_x + x
            point.y = new_y + y


    def dist(self, a, b):
        return math.sqrt(math.pow(a.x - b.x, 2) + math.pow(a.y - b.y, 2))

    def remove_noise(self):
        min_dist = 120
        amount_close = 5
        min_acc = 0.95

        for point in self.points:
            if point.acc < min_acc:
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

def dist(a, b):
    return math.sqrt(math.pow(a.x - b.x, 2) + math.pow(a.y - b.y, 2))

def translate_together(set_a, set_b):
    amount_correct = 70
    # Rotate the coordinates to the same rotation

    angle_ans = 0
    shortest = None
    for r in range(360):
        single_move = math.pi / 180

        set_b.translate(0,0,single_move)

        # check for the surrounding coordinate and how close it is
        angle_anw = 0
        shortest_all = []
        for p_a in set_a.points:
            if p_a.show == False: continue
            shortest = None
            for p_b in set_b.points:
                if p_b.show == False: continue
                if shortest == None: shortest = dist(p_b, p_a)
                d = dist(p_a, p_b)
                if shortest > d:
                    shortest = d
            shortest_all.append(shortest)

        # now i have a list of all the shortest distances from point at this angle
        shortest_all.sort()
        size = len(shortest_all)
        total = 0
        for i in range(len(shortest_all)):
            if (i < (size / 2) - (amount_correct / 2)): continue
            if (i > (size / 2) + (amount_correct / 2)): break
            total += shortest_all[i]
        total = total / size
        if (shortest == None or shortest < total):
            shortest = total
            angle_ans = r

        print(str(r) + "  " + str(angle_ans))
        # dont want shortest distance, looking for the most similar defect

    return angle_ans
    
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

    show_set(data, zoom)

def show_set(set, zoom=1):
    for i in set.points:
        if (i.show != True): continue
        visualize.create_rectangle(
            (i.x * zoom + (canvas_size / 2), i.y * zoom +
             (canvas_size / 2)) * 2,
            outline="black")

seta = Set("D:\Shared Folder\Downloads\Lidar Data 1653770284580.txt")
#setb = Set("D:\Shared Folder\Downloads\Lidar Data 1653770284580.txt")
setb = Set("D:\Shared Folder\Downloads\Lidar Data 1653770210021.txt")
setb.translate(250,-80,0)

seta.remove_noise()
setb.remove_noise()

seta.translate(0,0,0)
#setb.translate(0,0, (math.pi / 180) * translate_together(seta, setb)) # how to figure out these translation values without manual intervention?
show_set(seta, 0.1)
#show_set(setb, 0.1)



root.mainloop()