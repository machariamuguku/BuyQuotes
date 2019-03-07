var response = {
    "_id": {
        "$oid": "5c7fa325ded0c7681d8899bc"
    },
    "quotecategory": "programming",
    "quotes": [{
        "quote": "Talk is cheap. Show me the code.",
        "author": "Linus Torvalds"
    }, {
        "quote": "when you don't create things, you become defined by your tastes rather than ability. your tastes only narrow & exclude people. so create.",
        "author": "Why The Lucky Stiff"
    }, {
        "quote": "Programs must be written for people to read, and only incidentally for machines to execute.",
        "author": "Harold Abelson"
    }, {
        "quote": "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
        "author": "John Woods"
    }, {
        "quote": "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning.",
        "author": "Rick Cook"
    }]
}

let responseArray = response.quotes;


//console.log(responseArray[0].quote+" ---"+responseArray[0].author),console.log(responseArray[1].quote+" ---"+responseArray[1].author)
//solva 1

let joram;
responseArray.forEach((junior)=>{joram=junior})

console.log(joram)
// responseArray.forEach((object) => {
//     return (object.quote+""+object.author);
// });
// // console.log(responseArray)
// 1.
// items.forEach(function(element) {
//     console.log(element);
//   });


//2.
// let quotesobjects = items.map(function (item) {
//     return (item);
// });
// solva 1
// quotesobjects.forEach((object) => {
//     console.log(object)
//     return (object);

// });

//console.log(quotesobjects);
//2.
// var names = items.map(function (item) {
//     return (item);
// });
// // solva 1
// names.forEach(function (element) {
//     let jina = element.author;
//     let quota = element.quote;

//     console.log(quota);
//     console.log("also");
//     console.log(jina);
// });
// console.log(names);

// //2.1
// var names = items.map(function (item) {
//     return (item.quote+item.author);
// });
// console.log(names);

//3.
// var names = items.map(function (el) {
//     return (el.name+el.id);
// });
// console.log(names);