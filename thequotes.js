    ProgrammingObject = {
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
    };


    // function getQuotes(getQuotes) {
    //     var n = getQuotes.length;
    //     var output = '';
    //     for (var i = 0; i < n; i++) {
    //         console.log(getQuotes[i][2])
    //         // output += getQuotes[i][2].split(":", 1)[0];
    //     }
    //     return output;
    // }
    // // getQuotes(ProgrammingObject.quotes)
    // getQuotes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

   // truth
    getQuotes = (quoteObj) => {
        let n = quoteObj.length;
        var output = '';
        for (let i = 0; i < n; i++) {
           // console.log((i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author);
            output += ((i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author+"\n");
        }
        return output
    }
//    console.log(getQuotes(ProgrammingObject.quotes))
    /*
    format the querry as 2.1.1 bellow.
    N/B: replace getQuotes with the name you'll call it with
    i.e nameToCallWith = require(./thequotes.js)
    2.1.1 ...................................................................
    getQuotes(ProgrammingObject.quotes)
    */
    module.exports = getQuotes;