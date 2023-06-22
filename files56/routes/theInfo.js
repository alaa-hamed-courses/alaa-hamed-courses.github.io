const express = require("express");
const router = express.Router();
let دورة = "";
let fs = require('fs');
let path = require('path');
let coursesPath = path.join(__dirname, `../public`);
let coursesFilesPath;
let playlistID = [];

let courses = [];
fs.readdir(coursesPath, (err, folders) => {
    for(let i = 0; i < folders.length; i++) {
        let str = folders[i];
        if(str != "صور") {
            courses.push(str.trim());
            
            coursesFilesPath = path.join(__dirname, `../public/${folders[i]}/الرابط.txt`);
            fs.readFile(coursesFilesPath, "utf8", (err, data) => {playlistID.push([folders[i], data]);})
        }
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

router.get("/", (req, res) => {
    res.redirect("/all-courses");
});

router.get("/all-courses", (req, res) => {
    res.render("courses", {courses: courses, playlistID: playlistID});
});

// router.get("/all-courses/:id", (req, res) => {
//     console.log(req.params.id, 333333333);
// })

router.get("/all-courses/:id", (req, res) => {
    دورة = req.params.id;

    let voicePath = path.join(__dirname, `../public/${دورة}/صوت`);
    let pdfPath = path.join(__dirname, `../public/${دورة}/تفريغ وتشجير`);

    let names = [];
    fs.readdir(voicePath, (err, files) => {
        for(let i = 0; i < files.length; i++) {
            let str = files[i];
            str = right(str, str.length-5).split(".")[0];
            names.push(str.trim());
        }
    });
    
    let pdf = [];
    fs.readdir(pdfPath, (err, files) => {
        for(let i = 0; i < files.length; i++) {
            let str = files[i];
            str = right(str, str.length-5).split(".")[0].split(" - ");
            str != "op"? pdf.push(str) : "";
        }
    });
    
    let lessonInfo = [];
    setTimeout(() => {
        lessonInfo = check2Ds(names, pdf, 1, 0);
        // lessonInfo ==> [الخ ... "اسم الدرس", ["تفريغ", "كتاب"]]
        // console.log([names[15], pdf[52][1]], names[15] == pdf[52][1]); // عند ظهور مشاكل في اختلاف التسمية - اسم الملف
        res.render("index", {lesInfo: JSON.stringify(lessonInfo), course: دورة, courses: courses, playlistID: playlistID});
    }, 500);
});


module.exports = router;