import yuag
yuag.clear()

course_name = "فقه المواريث"

pdfs = yuag.filesIn(f"./public/{course_name}/تفريغ وتشجير")
audios = yuag.filesIn(f"./public/{course_name}/صوت")

tests = []
try:
    tests = yuag.readFile(f"./public/{course_name}/اختبارات.txt").split("\n")
    tests = {item.split("- ")[0]: "".join(yuag.removeFromArr(item.split("- "), 0)) for item in tests}
except:
    pass

names = [item.split(".mp3")[0].split("- ")[1] for item in audios]


data = [{
    "الإسم": item,
    "تفريغ": False,
    "تشجير": False,
    "تشجير مجمع": False,
    "تفريغ وتشجير": False,
    "قراءة من الكتاب": False,
    "ملخص مجمع": False,
    "اختبار": None
} for item in names]

for i, item in enumerate(pdfs):
    if item.split("- ")[0].isdigit():
        lesson_index = int(item.split("- ")[0])-1
        if lesson_index >= 0:
            if "- تفريغ - " in item: data[lesson_index]["تفريغ"] = True
            elif "- تشجير - " in item: data[lesson_index]["تشجير"] = True
            elif "- تشجير مجمع - " in item: data[lesson_index]["تشجير مجمع"] = True
            elif "- تفريغ وتشجير - " in item: data[lesson_index]["تفريغ وتشجير"] = True
            elif "- كتاب - " in item: data[lesson_index]["قراءة من الكتاب"] = True
            elif "- ملخص مجمع - " in item: data[lesson_index]["ملخص مجمع"] = True

            if str(lesson_index+1) in tests: data[lesson_index]["اختبار"] = tests[str(lesson_index+1)]

yuag.saveJSON(data, "البينات.json")

yuag.doneMessage(0)