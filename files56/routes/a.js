// {
// array = ["Ddd", 3, [98, "Eex,"]];
// array = [["awdd ", ["esw"]], ["qwdc", ["eaw"]]];

// // console.log(JSON.parse(`["Ddd",3,[98,"Eex,"]]`));


// function arrToString3(arr) {
//     str3 = [`[`];

//     for(let i = 0; i < arr.length; i++) {
//         if(typeof arr[i] != "object") {
//             typeof arr[i] == "string"? str3.push(`"${arr[i]}"`) : str3.push(arr[i]);
//         }
//         i < arr.length - 1? str3.push(", ") : "";
//     }
//     str3.push(`]`);
//     return str3.join("");
// }

// function arrToString2(arr) {
//     str2 = [`[`];

//     for(let i = 0; i < arr.length; i++) {
//         if(typeof arr[i] != "object") {
//             typeof arr[i] == "string"? str2.push(`"${arr[i]}"`) : str2.push(arr[i]);
//         } else {
//             str2.push(arrToString3(arr[i]));
//         }
//         i < arr.length - 1? str2.push(", ") : "";
//     }
//     str2.push(`]`);
//     return str2.join("");
// }

// function arrToString(arr) {
//     str = [`[`];

//     for(let i = 0; i < arr.length; i++) {
//         if(typeof arr[i] != "object") {
//             typeof arr[i] == "string"? str.push(`"${arr[i]}"`) : str.push(arr[i]);
//         } else {
//             str.push(arrToString2(arr[i]));
//         }

//         i < arr.length - 1? str.push(", ") : "";
//     }
//     str.push(`]`);
    
//     return str.join("");
// }

// console.log(arrToString(array));

// console.log(11111);
// let as = setInterval(() => {
//     if(1 == 1) {
//         console.log(333333333333);
//         clearInterval(as);
//     }
//     // break;
// })
// console.log(22222);
// }

let n1 = "ah ho ra";
let n2 = "ah ra";

function removeFromArr(arr,index,item = null) {
    arr = JSON.stringify(arr);
    arr = JSON.parse(arr);
    
    let turn;
    
    if(item != null) {
        index = arr.indexOf(item);
    }
    
    if(index <= arr.length-1 && index > -1) {
        arr.splice(index, 1);
        turn = arr;
    } else {
        turn = arr;
    }
    
    return turn;
}

// function mutualNames(n1, n2, options = 0) {// 
//     n1 = n1.trim().split(" ");
//     n2 = n2.trim().split(" ");
    
//     let n1Length = n1.length;
//     let sameStart = n1[0] == n2[0];
//     let notDiff = [];
//     for(let i = 0; i < n1Length; i++) {
//         if(n1.length > 0 && n2.length > 0) {
//             console.log(i, n1, n2);
//             if(n1[i] == n2[i] && i < n1.length) {
//                 notDiff.push(n1[i]);
//                 n1 = removeFromArr(n1, i);
//                 n2 = removeFromArr(n2, i);
//                 i--;
//             } else if(i < n1.length) {
//                 for(let j = 0; j < n2.length; j++) {
//                     if(n1[i] == n2[j]) {
//                         notDiff.push(n1[i]);
//                         n1 = removeFromArr(n1, i);
//                         n2 = removeFromArr(n2, j);
//                         i--;
//                     }
//                 }
//             }
//         }
//     }

//     sameName = false;
//     notDiff.length >= 2 && sameStart? sameName = true : "";
//     return options == 0? sameName : `[${JSON.stringify(n1)}, ${JSON.stringify(n2)}, ${JSON.stringify(notDiff)}]`;
// }

function mutualNames(n1, n2, options=0) {// 
    n1 = n1.toLowerCase().trim().split(" ");
    n2 = n2.toLowerCase().trim().split(" ");
    let newN1 = n1.trim().toLowerCase().split(" ");
    let newN2 = n2.trim().toLowerCase().split(" ");

    console.log(n1, newN1);
}
console.log(mutualNames("Adam Jibreel Janab", "Adam Kamal Perjessy"));