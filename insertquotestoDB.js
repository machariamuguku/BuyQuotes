const moongoseconn = require("./mongoDBconnector");

// The object to insert
let objectToInsert = {
    "quotecategory": "programming",
    "quotes": [{
            "quote": "Talk is cheap. Show me the code.",
            "author": "Linus Torvalds"
        },
        {
            "quote": "when you don't create things, you become defined by your tastes rather than ability. your tastes only narrow & exclude people. so create.",
            "author": "Why The Lucky Stiff"
        },
        {
            "quote": "Programs must be written for people to read, and only incidentally for machines to execute.",
            "author": "Harold Abelson"
        },
        {
            "quote": "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
            "author": "John Woods"
        },
        {
            "quote": "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning.",
            "author": "Rick Cook"
        }
    ]
}


//use moongose to insert the two objects in a mongoDB as a single object
moongoseconn.collection("Quotes").insertOne(objectToInsert);