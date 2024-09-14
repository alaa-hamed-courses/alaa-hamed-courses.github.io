function makeZeroNum(num, chars) {// 10, 3 ==> "010"
    num = JSON.stringify(num);
    let arr = [];

    for(let i = 0; i < chars - num.length; i++) {
        arr.push("0");
    }

    for(let i = 0; i < num.length; i++) {
        arr.push(num[i]);
    }

    return arr.join("");
}

async function getVideoIds(playlistId, apiKey) {// without max videos, with promis
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    let videoIds = [];
    let nextPageToken = '';
    do {
        const response = await fetch(url + (nextPageToken ? `&pageToken=${nextPageToken}` : ''));
        const data = await response.json();
        data.items.forEach(item => videoIds.push(item.snippet.resourceId.videoId));
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    
    return videoIds;
}

// الملفات
function loadAudio() {
    if(course_name in courses_data) {
        audio.querySelector("source").src = `/public/${course_name}/صوت/${makeZeroNum(active_lesson+1, 3)}- ${courses_data[course_name][active_lesson]["الإسم"]}.mp3`;
        audio.load();
    } else {
        audio.style.display = "none";
        theSpeed.style.display = "none";
    }
}

function loadOptions() {
    if(course_name in courses_data) {
        let lesson_info = courses_data[course_name][active_lesson];
        if(lesson_info["تفريغ"] == true) {
            availableOptionsChilds[0].style.display = "";
            availableOptionsChilds[0].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- تفريغ - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["تشجير"] == true) {
            availableOptionsChilds[1].style.display = "";
            availableOptionsChilds[1].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- تشجير - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["تشجير مجمع"] == true) {
            availableOptionsChilds[2].style.display = "";
            availableOptionsChilds[2].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- تشجير مجمع - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["تفريغ وتشجير"] == true) {
            availableOptionsChilds[3].style.display = "";
            availableOptionsChilds[3].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- تفريغ وتشجير - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["قراءة من الكتاب"] == true) {
            availableOptionsChilds[4].style.display = "";
            availableOptionsChilds[4].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- كتاب - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["ملخص مجمع"] == true) {
            availableOptionsChilds[6].style.display = "";
            availableOptionsChilds[6].href = `/public/${course_name}/تفريغ وتشجير/${makeZeroNum(active_lesson+1, 3)}- ملخص مجمع - ${courses_data[course_name][active_lesson]["الإسم"]}.pdf`;
        }
        if(lesson_info["اختبار"] != null) {
            availableOptionsChilds[5].style.display = "";
            availableOptionsChilds[5].href = lesson_info["اختبار"];
        }
    }
}

// إسم المقطع
function getVideoName(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&fields=items(id,snippet)&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const title = data.items[0].snippet.title;
            return title;
        });
}

let course_name = localStorage.getItem("active course");
let apiKey = "AIzaSyAW0sQyMBkCSeoPuHxB0eOozsaos3FywMw";

let availableOptions = document.querySelector(".available");
let availableOptionsChilds = availableOptions.querySelectorAll("a");
let lessonsList = document.querySelector(".lessons-list");
let lessonsListChilds = lessonsList.querySelectorAll("div h1");
let audio = document.querySelector("#lesson-player");
let lessonPlayer = audio.querySelector("source");
let theSpeed = document.querySelector(".voice-speed");

document.querySelector("title").innerText = course_name;

let courses_links = {
    "أساسيات الطريق إلى الله": "PL1i_D1Vw3d5NYUb87ULvvfMxV3yqWliBd",
    "الأسرار الثمان لطالب فهم القران": "PL1i_D1Vw3d5MkevimMdJRVLi4TiVFd-wE",
    "ألواح ودسر": "PLVjnNfclNn92c2cAK9sG9xCC0nVZ7HVuo",
    "أنوار الكهف": "PL1i_D1Vw3d5OpfTVO-1cruvgtBlo9xOjE",
    "الداء والدواء": "PL1i_D1Vw3d5PBeIjJipobiLY1y4VKyg9c",
    "العقيدة": "PL1i_D1Vw3d5OOCuGDrC-t3cBIrSmYRAsg",
    "علمني رسول الله": "PL1i_D1Vw3d5MtZyd56B0IRjyEPCCHs1zd",
    "فقه المواريث": "PL1i_D1Vw3d5NDnT2pN5_-buL6JS7tyK8-",
    "فن التعامل مع النفس": "PL1i_D1Vw3d5OIgXke0B-d99auBBkFavry",
    "فن الحياة": "PL1i_D1Vw3d5Ovij-8NwvuNUYG_YXKg_pY",
    
    "بثوث": "PL1i_D1Vw3d5PX-mOu2W32juBWa_0YKtOC",
    "برنامج 3 دقائق الموسم 1": "PL1i_D1Vw3d5MjeqIK584tlnsKpl-Rgjxf",
    "برنامج 3 دقائق الموسم 2": "PL1i_D1Vw3d5M3bx2Qft7_jcSGU8C-W5IA",
    "برنامج السر": "PL1i_D1Vw3d5P0Nj-so9k3x0drqe-dHsWX",
    "برنامج المصير": "PL1i_D1Vw3d5OGqD3PQDgVbF_DVMI4hrJT",
    "برنامج باسمك نحيا": "PL1i_D1Vw3d5OdEWLlSZpbTlKPO9t76WkC",
    "برنامج شخابيط": "PL1i_D1Vw3d5PM07Pntb-13QiQjogJhSd9",
    "برنامج نص ساعة لقلبك": "PL1i_D1Vw3d5NanBKQ_Q513J68a8muAhcS",
    "قصص القرآن": "PL1i_D1Vw3d5O3r_DZ9LtWUWk2SQKQ0rYi",
    "مدرس دين": "PL1i_D1Vw3d5O8VKdpyimK0a6_b4mRbakA",
}

let courses_data = {
    "أساسيات الطريق إلى الله": [
        {
            "الإسم": "لحظة صدق",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "نفسي أكون ملتزم بجد",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "كشف حساب",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "أسرار التوبة",
            "تفريغ": true,
            "تشجير": false,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة توبة قاتل أمه",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الصلاة أولا",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "كيف أخشع في صلاتي",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "كيف أخشع في صلاتي 2",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "اشحن التزامك بقيام الليل",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "صاحبي القران",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "مفاتيح تدبر القران",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "عسل بالخل",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "كيف اتعامل مع الوالدين بعد الإلتزام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "سوبر ملتزم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "وقل رب زدني علما",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "نصائح في طلب العلم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "كيف أحفظ القران",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الداعية المحترف",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "نفسي اتعلم الدعوة الى الله",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "أوصف لي طريق الإلتزام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الخطة الخماسية للوصول إلى الله",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "الأسرار الثمان لطالب فهم القران": [
        {
            "الإسم": "الأسرار الثمانية لفهم القران",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر الأول افهم زيهم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "أقرأ التفسير ولا أفهم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر الثاني إدراك المعني اللغوي",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر الثالث فهم حروف المعاني",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر الرابع فهم دلالة الجملة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر الخامس والسادس السياق وموضوع السورة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السر السابع والثامن",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "ألواح ودسر": [
        {
            "الإسم": "أول شرك وأول رسالة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "شبهات واهية",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "دعوة وصبر وثبات",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "اصنع سفينتك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "العاقبة للمتقين",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "أنوار الكهف": [
        {
            "الإسم": "علاقة سورة الكهف بالدجال",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScduFnZDO3jHnnfajNwYACFbpvRzU1uCPZ4Rh0JweXx4AGT2w/viewform"
        },
        {
            "الإسم": "نور وسط الظلام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdHVCJKmRqoTG6gJ4110JWTUZzq_Inu7ruJUdFEIj-nL3XneA/viewform"
        },
        {
            "الإسم": "ما وراء الطبيعة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSesSA35KvVZBNWiyRV-LBrWZY3xHOzaNtkbhWPngQDb82QNnQ/viewform"
        },
        {
            "الإسم": "كنوز الكهف",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfFQnm_9hPeKn37IKj-ye7-S5CiyMC-5XexzAzVQv5DmHGywg/viewform"
        },
        {
            "الإسم": "روشتة مواجهة الفتن",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSf-02KIQSYqz7U2EdlQVx2GXoKYUP9EllAD_6_lhkC7GT-UXw/viewform"
        },
        {
            "الإسم": "صاحب الجنتين والصراع المادي الإيماني",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeg7A_qOFyabPbpMi8mj9JsT3IJP63dr5aVidcgo69NGH1V8w/viewform"
        },
        {
            "الإسم": "الموقف الرهيب",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdN8VeGm0e-LWm6hHH8PGj1ILljDqriQ0RP6NMcf03hgzZGPw/viewform"
        },
        {
            "الإسم": "معركة الشيطان",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeepannnXyH0deMxmxv4TCGm9yxwJ5l-7YCg4b2LCPR8T2kPw/viewform"
        },
        {
            "الإسم": "هزيمة الشيطان",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdvqnJfgHbYCZiGPaBPGa_yw59Yj0KAbHT0tRMvW7CW3V0IFQ/viewform"
        },
        {
            "الإسم": "آيات منسية",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScHpoJ8u9e3uNu8CleO7U2d_3-KMzvZWh2ruspRhnU7dAgbFA/viewform"
        },
        {
            "الإسم": "علمني موسى عليه السلام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdY15-SjP_MELctJ6bw6SVKwJKFF3J193h-rwsY1TVaebF2fg/viewform"
        },
        {
            "الإسم": "علمني الخضر عليه السلام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfRCJykXdJKdpTcB7lLVeEVBcm48wG6jY7MXvWJLBVE0ZcYcw/viewform"
        },
        {
            "الإسم": "ما لا تعرفه عن ذي القرنين",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSddGzbTEXRoRUUXL9KXNr0Sq09sJZU6DEmKmKa9lOsiWBplYg/viewform"
        },
        {
            "الإسم": "مسك الختام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScGHAJKs8FNgUFtGkYPdn4oKR-o9u5aynapupMDZNe7vM2XIA/viewform"
        }
    ],
    "الداء والدواء": [
        {
            "الإسم": "لماذا كتاب الداء والدواء",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSepeFKocNSPlWU0pCbUiTXx5HrHjqE39IIyvD1aP4w3b_ee3A/viewform"
        },
        {
            "الإسم": "أخطر أنواع المسكنات",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdyS0JiuFkwDiAjJye6BAb2n91l8QrzkMexhjg4pa1U7wFbUA/viewform"
        },
        {
            "الإسم": "تشخيص الداء وأضرار الذنوب والمعاصي",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeKv7KVAFwcM68F-waAujfd90O3emUQ0vXH2ebLPGWi_L7rHg/viewform"
        },
        {
            "الإسم": "المرض الفتاك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSej5ti53v7bhfGzTPaQTxhombfBZu_G2aHoHTsvXLgQrLOQJA/viewform"
        },
        {
            "الإسم": "المعاصي تدمرك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdcXbxOOwVsojAVo4ea4_gl8scd_OXg9g4Uk64VdSt2Snyzcg/viewform"
        },
        {
            "الإسم": "أسئلة وجودية حائرة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSe-PJSGjx3Rsw8j7OBioZr-WY3sG6xp6T-8XtoPIvzI9snK6g/viewform"
        },
        {
            "الإسم": "مداخل الشيطان",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScRmj5c_5tHsz3h5jFjxal3ECja5ARr0HCIdQGHsY5g4rbAzQ/viewform"
        },
        {
            "الإسم": "طبيعة الصراع بين الشيطان والإنسان",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfzPdHXnjt5HVtCsHFOIPx79XykqBlpihn2_cdq1TCr9zt6ag/viewform"
        },
        {
            "الإسم": "كيف تصل إلى القلب السليم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfISpi3zNP0ubTt7P3ZUn8dRKEchD84xi1XNoX_HSXmg_FQ6Q/viewform"
        },
        {
            "الإسم": "أعظم الذنوب",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdKualpveQKs_86WjhJl6ZNyvht4sAGHJfnP4WrOGd57Yu2Yg/viewform"
        },
        {
            "الإسم": "الحصون الأربعة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeJCsHY_pq2wGSbU19BM0Ci6qqm14i9m6kTUcHLHmFfa5FsAA/viewform"
        },
        {
            "الإسم": "الشهوة الحرام والزنا واللواط",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfDZ8QNYgaDAHk5aliuQrGrkFHEhGp-2KsO0YL3uDYO7_12fA/viewform"
        },
        {
            "الإسم": "الدواء الجامع لكل داء",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeJ7ySAwVR43EgEbYsvpNNdyV1mGce1tAAr58T0Icwu2P57JQ/viewform"
        },
        {
            "الإسم": "صراع العقل والهوى",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScFGEbrTrmTWq0kWWms7xQoMLnXCzhr0c3TK_za4hskvRNwkw/viewform"
        },
        {
            "الإسم": "العشق المحرم",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSclEOjUlO114-QkJApapEfh23T4DYm_vSUDfseTCUzUXTAV4g/viewform"
        },
        {
            "الإسم": "الحب الحلال",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdYZTkjk-johWQKcqk0lgc83TsBkACWyLfLbpMhQ6fQFQLn4Q/viewform"
        }
    ],
    "العقيدة": [
        {
            "الإسم": "20 سبب لدراسة العقيدة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfUyE1pIscyJ8GaQiET_GW_plGEq77llE_Z-52WdCKrM3LDvQ/viewform"
        },
        {
            "الإسم": "توحيد الربوبية",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScJGiCRRy9o1nRl3k3Q2gvupY5ZSYPvK13KJBYevC-9xkRZHA/viewform"
        },
        {
            "الإسم": "مناقشة الملحدين",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfyYebUcnNGmKE1IT0Qelvuawtn93qC1YqmmxsZZkk0qqQSug/viewform"
        },
        {
            "الإسم": "توحيد الألوهية",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeb8NI-QdEFEUGp8AoAXP3QK-i0GCERn43Sqv4e64UPXLJsYQ/viewform"
        },
        {
            "الإسم": "أنواع العبادات",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLScZ9xMEp--4BeF8jJW43YtYOmq7BktQuiJpcG27exQiST3g7Q/viewform"
        },
        {
            "الإسم": "القبور والتوسل",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfvOJrYeaBRuOdfkbEHxOOm-EELIY9URcuw9CtbgoQko6SXfw/viewform"
        },
        {
            "الإسم": "التوسل الممنوع",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSc0v5S40t9S6Xl3gxWEv1moayz_frmJWGnObCZvQychfb5GKw/viewform"
        },
        {
            "الإسم": "أنواع الشرك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdKVFEvJbfsqkmES4nv1Hhh6dJ1FZAx-bBT8jQvorYUB86hsA/viewform"
        },
        {
            "الإسم": "السحر والتنجيم والكهانة",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSftw0ASNLp7V_W55tYXVDeOjOqCpboyPYUzc3jHbr9MuULrog/viewform"
        },
        {
            "الإسم": "الإيمان الصحيح",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeLzQWji2T4fLwsK-PmXVkTnKvLc9St0Pg3MJ73oLN5wScnHw/viewform"
        },
        {
            "الإسم": "تصحيح الإيمان",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeWJ6ut-Kfr_n-jASU_vu-kyMthfMWXd_aFBuc85pqBfW-8QA/viewform"
        },
        {
            "الإسم": "الرد على أهل البدع",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSelwJ9Z0Wnle2ZzlFGRZwo3QXMR2cxho101DB3i9TpcwGqCtw/viewform"
        },
        {
            "الإسم": "الملائكة",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSfs2FCjl1K-i2Jy5fFFfp-b8TsAUVNP9lqG16PiPVLb4cYDvw/viewform"
        },
        {
            "الإسم": "الإيمان بالكتب",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSetnbJSlYdfmFaU4FSFlO_pTPROgyfQAlKil1cphYc4Jf5RtQ/viewform"
        },
        {
            "الإسم": "الإيمان بالرسل",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdkxME2CYXGNmRnnAdXGXutwXdVngqQ1DsN2qGzKznu9H3ksA/viewform"
        },
        {
            "الإسم": "حقوق النبي على الأمة",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSdHd3T4at2ruxg3_DlVW_0QrRWMWR2fFU2o5ACcnTMQc6aGtg/viewform"
        },
        {
            "الإسم": "الإسراء والمعراج",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeslNmTX6gbjy87Y_q4LlFQJR8f4btf-71U4fpR-m_C3UIpJQ/viewform"
        },
        {
            "الإسم": "أشراط الساعة الصغرى",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSepRiGwZDRhZY5Zv0GbLbi9Q-9JoxicvJ7TWabINeUbUyo39w/viewform"
        },
        {
            "الإسم": "أشراط الساعة الكبرى",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSewgLd7DpcJlzM1GEoDP1lljJWWhV-bq8z5On7DCKoSxpmCiA/viewform"
        },
        {
            "الإسم": "نعيم القبر وعذابه",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/1qp7i7IesieZRgQW09orozOK2UuaOkq6-pmyA7UncYno/viewform"
        },
        {
            "الإسم": "مشاهد يوم القيامة",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/1qZLkhlYOpqk2qvgPskn1kYr-z2bD5EzNGh4XBbqBxcI/viewform"
        },
        {
            "الإسم": "هل الإنسان مخير أم مسير",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/1pd4fB9FutGaAkH-1WgNHuH9e638cvmyW0MUofsizFcg/viewform"
        },
        {
            "الإسم": "التكفير",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSeUXmzgHsPS86Ts50iXUEGh0plCV_QxF8DZ_OfKzN3Jg_8Mag/viewform"
        },
        {
            "الإسم": "التكفير 2",
            "تفريغ": false,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": true,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": "https://docs.google.com/forms/d/e/1FAIpQLSez682YqMyHsFuEUmcjd30oincwAvw6IUs99dzTlvfQtr1FQA/viewform"
        },
        {
            "الإسم": "الولاء والبراء",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "عقيدتنا في الصحابة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": true,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "معرفة عقائد الشيعة",
            "تفريغ": true,
            "تشجير": false,
            "تشجير مجمع": true,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": true,
            "اختبار": null
        }
    ],
    "علمني رسول الله": [
        {
            "الإسم": "عجوز بني إسرائيل",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "صوت في سحابة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "السفاح الذي صار من أولياء الله",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الأعمى الذي أبصر الحقيقة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة في مكان غريب",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة الأساطير الثلاثة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة السطر الواحد",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "تلميذ بين أستاذين",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة المحنة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "وانتصر الغلام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الخشبة العجيبة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصة جريج العابد",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "وللنساء قصص",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "قصص الرحمة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "فقه المواريث": [
        {
            "الإسم": "الدرس الأول",
            "تفريغ": false,
            "تشجير": false,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الدرس الثاني",
            "تفريغ": false,
            "تشجير": false,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الدرس الثالث",
            "تفريغ": false,
            "تشجير": false,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "الدرس الرابع",
            "تفريغ": false,
            "تشجير": false,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "فن التعامل مع النفس": [
        {
            "الإسم": "النفسية محتاجة ايه",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "معادلة بسيطة لقياس إيمانك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "إعرف نفسك صح الأول",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "ازاي تقنع نفسك بالإلتزام",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "علاج أخطر أمراض النفس",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "حل مشكلة الصراع النفسي",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "حطم صنم نفسك",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "حطم صنم نفسك 2",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ],
    "فن الحياة": [
        {
            "الإسم": "فن معالجة الأخطاء",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن معالجة الأخطاء 2",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن مواجهة الإبتلاء",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "المرض الجميل",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن اكتشاف الذات",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن التعامل مع الخلاف",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن التعامل مع الناس",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن الدعوة الفردية",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن الدعوة الفردية 2",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "فن اختيار شريك الحياة",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        },
        {
            "الإسم": "لغات الحب الخمس",
            "تفريغ": true,
            "تشجير": true,
            "تشجير مجمع": false,
            "تفريغ وتشجير": false,
            "قراءة من الكتاب": false,
            "ملخص مجمع": false,
            "اختبار": null
        }
    ]
}

// كتابة أسماء الدروس وتفعيل الدرس الحالي
let active_lessons = JSON.parse(localStorage.getItem("active lessons info")); // obj[int]
let active_lesson = active_lessons[course_name];
let courseVideosLinks = getVideoIds(courses_links[course_name], apiKey);
let course_info = courses_data[course_name];
if(course_name in courses_data) { // دورة بـ ملفات
    // كتابة أسماء الدروس
    for(let i = 0; i < course_info.length; i++) {
        const lessonClick = document.createElement("h1");
        lessonClick.innerText = courses_data[course_name][i]["الإسم"];
        lessonsList.querySelector("div").append(lessonClick);
        
        if(i == active_lessons[course_name]) {
            lessonClick.classList.add("active");
        }
    }
    
    // تشغيل المقاطع iframe
    courseVideosLinks.then(data => {
        courseVideosLinks = data;
        document.querySelector("iframe").src = "https://www.youtube.com/embed/" + courseVideosLinks[active_lessons[course_name]] + "?rel=0";
    });
} else { // برنامج من غير ملفات
    courseVideosLinks.then(data => {
        courseVideosLinks = data;
        course_info = courseVideosLinks;

        for(let i = 0; i < course_info.length; i++) {
            const lessonClick = document.createElement("h1");

            // url: رابط للحصول على إسم المقطع
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${courseVideosLinks[i]}&fields=items(id,snippet)&key=${apiKey}`;
            fetch(url)
            .then(response => response.json())
            .then(data => {
                const title = data.items[0].snippet.title;
                lessonClick.innerText = title;
            });

            lessonsList.querySelector("div").append(lessonClick);

            // تشغيل المقاطع وتفعيل الدرس الحالي
            if(i == active_lessons[course_name]) {
                lessonClick.classList.add("active");
                document.querySelector("iframe").src = "https://www.youtube.com/embed/" + courseVideosLinks[i] + "?rel=0";
            }
        }
    });
}

// اختيار درس
lessonsList.onclick = (eo) => {
    if(eo.target.tagName == "H1") {
        // إلغاء تفعيل الدرس السابق
        lessonsList.querySelectorAll("h1")[active_lessons[course_name]].classList.remove("active");
        
        // الحصول على رقم الدرس
        let lesson_index = Array.from(lessonsList.querySelectorAll("h1")).indexOf(eo.target);
        active_lessons[course_name] = lesson_index;
        active_lesson = active_lessons[course_name];

        // تفعيل الدرس الحالي
        eo.target.classList.add("active");
        localStorage.setItem("active lessons info", JSON.stringify(active_lessons));
        
        // تحميل الخصائص
        loadAudio();
        loadOptions();
        
        // تشغيل المقطع
        document.querySelector("iframe").src = "https://www.youtube.com/embed/" + courseVideosLinks[lesson_index] + "?rel=0";
    }
}


// الصوت
loadAudio();

// سرعة الصوت
let one = theSpeed.querySelector(".one");
let oneTwentyFive = theSpeed.querySelector(".one-twenty-five");
let oneFive = theSpeed.querySelector(".one-five");
let oneSeventyFive = theSpeed.querySelector(".one-seventy-five");
let two = theSpeed.querySelector(".two");

one.onclick = () => {audio.playbackRate=1;}
oneTwentyFive.onclick = () => {audio.playbackRate=1.25;}
oneFive.onclick = () => {audio.playbackRate=1.5;}
oneSeventyFive.onclick = () => {audio.playbackRate=1.75;}
two.onclick = () => {audio.playbackRate=2;}


// إخفاء الخيارات المتاحة - تشجير - تفريغ - قراءة من الكتاب
availableOptionsChilds.forEach((item) => {
    item.style.display = "none";
});

// تفريغ وتشجير
loadOptions();