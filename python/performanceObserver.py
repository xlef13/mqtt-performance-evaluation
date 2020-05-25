import time


class PerformanceObserver:
    marks=[]
    result = ""
    def mark(this, name):
        now = time.time()
        existingIndex = this.getMarkIndexByName(name)
        if existingIndex:
            this.marks.pop(existingIndex)
        this.marks.append({'name': name, 'entryType': 'mark', 'startTime': now, 'duration': 0})
        return True

    def measure(this, name, markFrom, markTo):
        this.result += str(name) + ';' + str(this.getMarkByName(markTo)['startTime']-this.getMarkByName(markFrom)['startTime']) + ';' + str(this.getMarkByName(markTo)['startTime']) + "\n"
        return

    def getMarkByName(this, name):
        for mark in this.marks:
            if mark['name'] == name:
                return mark
        return None

    def getMarkIndexByName(this, name):
        for index, mark in enumerate(this.marks):
            if mark['name'] == name:
                return index
        return None

    def printResult(this):
        print(this.result)
