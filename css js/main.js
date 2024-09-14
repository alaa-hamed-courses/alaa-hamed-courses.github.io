function makeCourse(cont, course_name) {
    let article = document.createElement("article");
    let a = document.createElement("a");
    let img = document.createElement("img");

    a.href = "course.html";
    a.classList.add("get-href");
    img.src = `./public/صور/${course_name}.png`;
    img.alt = course_name;

    a.onclick = () => {
        localStorage.setItem("active course", course_name);
    }

    article.appendChild(a);
    article.appendChild(img);

    cont.appendChild(article);
}

function equalArr(arr, dimentions = 1) {
    let res = [];

    let i = 0;
    while (i < arr.length) {
        if (dimentions == 1) {
            res.push(arr[i]);
        } else {
            res.push([]);
            let e = 0;
            while (e < arr[i].length) {
                if (dimentions == 2) {
                    res[i].push(arr[i][e]);
                } else {
                    res[i].push([]);
                    let f = 0;
                    while (f < arr[i][e].length) {
                        res[i][e].push(arr[i][e][f]);
                        f += 1;
                    }
                }
                e += 1;
            }
        }
        i += 1;
    }

    return res;
}

function addArr(arr1, arr2) {
    let arr = equalArr(arr1);
    for(let i = 0; i < arr2.length; i++) {
        arr.push(arr2[i]);
    }

    return arr;
}

function makeObj(arr, value) {
    let res = {};
    for(let i = 0; i < arr.length; i++) {
        res[arr[i]] = value;
    }

    return res;
}

let courses = [
    "أساسيات الطريق إلى الله",
    "الأسرار الثمان لطالب فهم القران",
    "ألواح ودسر",
    "أنوار الكهف",
    "الداء والدواء",
    "العقيدة",
    "علمني رسول الله",
    "فقه المواريث",
    "فن التعامل مع النفس",
    "فن الحياة",
].sort();

let lives = [
    "بثوث",
    "برنامج 3 دقائق الموسم 1",
    "برنامج 3 دقائق الموسم 2",
    "برنامج السر",
    "برنامج المصير",
    "برنامج باسمك نحيا",
    "برنامج شخابيط",
    "برنامج نص ساعة لقلبك",
    "قصص القرآن",
    "مدرس دين",
].sort();

// بينات المشاهدة
if(localStorage.getItem("active lessons info") == null) {
    // {"course": 0}
    localStorage.setItem("active lessons info", JSON.stringify(makeObj(addArr(courses, lives), 0)));
}

let coursesCont = document.querySelector(".courses-cont");
let livesCont = document.querySelector(".lives-cont");

// عمل الدورات
for(let i = 0; i < courses.length; i++) {
    makeCourse(coursesCont, courses[i]);
}

// عمل البرامج
for(let i = 0; i < lives.length; i++) {
    makeCourse(livesCont, lives[i]);
}
