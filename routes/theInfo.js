const express = require("express");
const router = express.Router();
let دورة = "";
let fs = require('fs');
let path = require('path');
let coursesPath = path.join(__dirname, `../public`);
let playlistID = [];
let namesFiles = [];
let startVideoInArr = [];
let isTests = [];
let isError = [];
let reload = 0; // is page reloaded

// اعدادات
router.use(express.json()); 

const cors = require('cors');
router.use(cors());

// إعداد قاعدة البيانات SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// إنشاء جدول لتخزين البيانات
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS shared_data (course TEXT PRIMARY KEY, active_lesson INTEGER)");

    // // إضافة بيانات تجريبية إلى الجدول
    // const initialData = [
    //     "قيمة 1",
    //     "قيمة 2",
    //     "قيمة 3"
    // ];

    // const insertStatement = db.prepare("INSERT INTO shared_data (data) VALUES (?)");

    // for (const value of initialData) {
    //     insertStatement.run(value);
    // }

    // insertStatement.finalize();
});


let courses = [];
let myData = [];
fs.readdir(coursesPath, async (err, folders) => {
    await deleteDataFromDatabase();

    for (let i = 0; i < folders.length; i++) {
        let str = folders[i];
        if (str !== "صور") {
            courses.push(str.trim());
            myData.push({ "course": str.trim(), "active_lesson": 1 });

            const coursesFilesPath = path.join(__dirname, `../public/${folders[i]}/الرابط.txt`);
            const data = fs.readFileSync(coursesFilesPath, "utf8");

            startVideoInArr.push(data.split("\r\n").length > 1 ? parseInt(data.split("\r\n")[1]) : 0);
            data.split("\r\n").length > 2 && data.split("\r\n")[2] !== "" ? namesFiles.push([folders[i], 0]) : namesFiles.push([folders[i], 1]);
            playlistID.push([folders[i], data.split("\r\n")[0]]);
        }
    }

    // push data to table
    for (let i = 0; i < myData.length; i++) {
        await saveDataToDatabase(myData[i]["course"], myData[i]["active_lesson"]);
    }
});

function right(str, chr) {
    return str.slice(str.length-chr,str.length);
}

function check2Ds(arr1D, arr2D, i, ires) { // 1D=[1,2,3], 2D=[ [10,1], [20,1], [30,2], [40,2] ], i=1, ires=0 ==> [ [1, [10,20]], [2, [30, 40]], [3, []] ] ]
    let final = [];
    for(let d = 0; d < arr1D.length; d++) {
        let tmp = [];
        for(let e = 0; e < arr2D.length; e++) {
            if(arr2D[e][i] != undefined) {
                arr2D[e][i].trim() == arr1D[d].trim()? tmp.push(arr2D[e][ires]) : "";
            }
        }
        final.push([arr1D[d], tmp]);
    }

    return final;
}

function search2D(arr, item, column_search = 0, column_result = 1) {
    let res = [];
    let i = 0;
    while(i < arr.length) {
        if(arr[i][column_search] == item)
            res.push(arr[i][column_result]);
        i++;
    }

    return res;
}

function searchInObjArr(arr, key_want_search, value_want_search) {
    const res = [];
    const ind = [];

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (typeof item === 'object' && item !== null) {
            if (key_want_search in item && item[key_want_search] == value_want_search) {
                res.push(item);
                ind.push(i);
            }
        }
    }

    return [res, ind];
}

// البينات
router.get('/get-data', (req, res) => {
    // تعيين رأس الاستجابة لتحديد نوع المحتوى
    res.setHeader('Content-Type', 'application/json');

    // استعراض البيانات المخزنة في قاعدة البيانات
    db.all("SELECT * FROM shared_data", (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        // إرجاع البيانات بتنسيق JSON
        res.json(rows);
    });
});

router.post('/save-data', (req, res) => {
    const { course, active_lesson } = req.body;

    // حفظ البيانات في قاعدة البيانات
    db.run("INSERT OR REPLACE INTO shared_data (course, active_lesson) VALUES (?, ?)", [course, active_lesson], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        const savedDataId = this.lastID;
        res.send(`تم حفظ البيانات بنجاح بالرقم: ${savedDataId}`);
    });
});

router.put('/update-data/:course', (req, res) => {
    const courseToUpdate = req.params.course;
    const { active_lesson } = req.body;

    // التحقق مما إذا كانت الدورة موجودًا
    db.get("SELECT * FROM shared_data WHERE course = ?", [courseToUpdate], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            // إذا كانت الدورة موجودًا، يتم تحديث البيانات
            db.run("UPDATE shared_data SET active_lesson = ? WHERE course = ?", [active_lesson, courseToUpdate], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({ message: `تم تحديث البيانات بنجاح` });
            });
        } else {
            // إذا كانت الدورة غير موجود، يتم إنشاء سجل جديد
            db.run("INSERT INTO shared_data (course, active_lesson) VALUES (?, ?)", [courseToUpdate, active_lesson], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                const newRecordId = this.lastID;
                res.json({ message: `تم إنشاء سجل جديد بالرقم: ${newRecordId}` });
            });
        }
    });
});

router.delete('/delete-data', (req, res) => {
    db.run("DELETE FROM shared_data", (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.send("تم حذف البيانات بنجاح");
    });
});

// دوال البينات
async function getDataFromServer() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM shared_data', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function saveDataToDatabase(course, lesson) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO shared_data (course, active_lesson) VALUES (?, ?)', [course, lesson], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function updateDataInDatabase(course, lesson) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE shared_data SET active_lesson = ? WHERE course = ?', [lesson, course], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function deleteDataFromDatabase() {
    return new Promise((resolve, reject) => {
        // تنفيذ عملية حذف البيانات في قاعدة البيانات
        db.run("DELETE FROM shared_data", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve("تم حذف البيانات بنجاح");
            }
        });
    });
}





// الصفحات
router.get("/", (req, res) => {
    res.redirect("/all-courses");
});

router.get("/all-courses", (req, res) => {
    res.render("courses", {courses: courses, playlistID: playlistID, namesFiles: namesFiles});
});

router.get("/all-courses/:course", (req, res) => {
    getDataFromServer().then((data) => {
        let course = req.params.course;
        res.redirect(`/all-courses/${course}/${searchInObjArr(data, "course", course)[0][0]["active_lesson"]}`);
    });
});

router.get("/all-courses/:course/:id", (req, res) => {
    isTests = [];
    دورة != ""? reload = (دورة == req.params.course? 1 : 0) : "";

    دورة = req.params.course;
    isError = [];
    updateDataInDatabase(دورة, parseInt(req.params.id)).then((update_data) => {
        let courseInterval = setInterval(() => {
            if(دورة == req.params.course) {
                let voicePath = path.join(__dirname, `../public/${دورة}/صوت`);
                let pdfPath = path.join(__dirname, `../public/${دورة}/تفريغ وتشجير`);
                let filesPath = path.join(__dirname, `../public/${دورة}`);
                let a = "";

                // tmp vars, cont ==> continue
                let contTests = 0;
                let cont = [["names", 0], ["pdf", 0], ["tests", 0]];

                // names
                let names = [];
                fs.readdir(voicePath, (err, files) => {
                    a = files;
                    if(files != undefined) {
                        for(let i = 0; i < files.length; i++) {
                            let str = files[i];
                            str = right(str, str.length-5).split(".")[0];
                            names.push(str.trim());
                        }
                    } else {isError.push(1);}

                    cont[0][1] = 1;
                });

                // pdf
                let pdf = [];
                fs.readdir(pdfPath, (err, files) => {
                    if(files != undefined) {
                        for(let i = 0; i < files.length; i++) {
                            let str = files[i];
                            str = right(str, str.length-5).split(".")[0].split(" - ");
                            str != "op"? pdf.push(str) : "";
                        }
                    } else {isError.push(2);}

                    cont[1][1] = 1;
                });
                
                let waitInterval = setInterval(() => {
                    if(cont[0][1] == 1 && cont[1][1] == 1) {
                        if(namesFiles[courses.indexOf(دورة)] == 0) {
                            names = [];
                            pdf = [];
                            isError = 0;
                        }

                        clearInterval(waitInterval);
                    }
                })
                
                // isTest
                let contIsTests = 0;
                let isTestInterval = setInterval(() => {
                    if(دورة == req.params.course) {
                        fs.readdir(filesPath, (err, files) => {
                            if(files != undefined) {
                                for(let i = 0; i < files.length; i++) {
                                    let str = files[i];
                                    if(str.split(".txt")[0] == "اختبارات") {
                                        isTests.push(1);
                                    }
                                }
                            } else {isError.push(3);}

                            contIsTests = 1;
                            
                        });

                        clearInterval(isTestInterval);
                    }
                });

                let tests = [];
                let theTestsInterval = setInterval(() => {
                    if(contIsTests == 1 && cont[2][1] == 0 && دورة == req.params.course) {
                        if(isTests.length > 0) {
                            testsPath = path.join(__dirname, `../public/${دورة}/اختبارات.txt`);
                            fs.readFile(testsPath, "utf8", (err, data) => {
                                let waitInterval = setInterval(() => {
                                    if(data != undefined) {
                                        for(let i = 0; i < data.split("\r\n").length; i++) {
                                            let test = data.split("\r\n")[i];
                                            tests.push([test.split("- ")[0], test.split("- ")[1]]);
                                        }

                                        contTests = 1;

                                        clearInterval(waitInterval);
                                    }
                                });
                            });
                        } else {contTests = 1;}

                        cont[2][1] = 1;
                        clearInterval(theTestsInterval);
                    }
                });

                // open course
                let lessonInfo = [];
                let testsInterval = setInterval(() => {
                    if(contTests == 1) {
                        lessonInfo = check2Ds(names, pdf, 1, 0);
                        // lessonInfo ==> [الخ ... "اسم الدرس", ["تفريغ", "كتاب"]]
                        isError.length == 0? res.render("index", {fff: a, lesInfo: JSON.stringify(lessonInfo), course: دورة, courses: courses, playlistID: playlistID, startVideoIn: startVideoInArr, tests: tests, namesFiles: namesFiles, reload: reload}) : res.status(404).send(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>خطأ</title>
                            <link data-default-icon="/public/صور/شعار.png" data-badged-icon="/public/صور/شعار.png" rel="shortcut icon" type="image/x-icon" href="/public/صور/شعار.png">
                        </head>
                        <body>
                            <h1>هذه الدورة غير موجودة</h1>
                        </body>
                        <script>
                            console.log("isError = [" + ${JSON.stringify(isError.sort((x, y) => x - y))} + "]");
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 5000);
                        </script>
                        </html>
                        `);

                        clearInterval(testsInterval);
                    }
                });

                clearInterval(courseInterval);
            }
        });
    });
});

module.exports = router;
