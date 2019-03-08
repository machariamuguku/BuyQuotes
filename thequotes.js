//1.
programming = {
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

//2.
workout = {
    "quotecategory": "workout",
    "quotes": [{
        "quote": "Training gives us an outlet for suppressed energies created by stress and thus tones the spirit just as exercise conditions the body.",
        "author": "Arnold Schwarzenegger"
    }, {
        "quote": "Strength does not come from the physical capacity. It comes from an indomitable will.",
        "author": "Ghandi"
    }, {
        "quote": "Your body can stand almost anything. It’s your mind that you have to convince.",
        "author": "Anonymous"
    }, {
        "quote": "Fitness is like a relationship. You can’t cheat and expect it to work.",
        "author": "Anonymous"
    }, {
        "quote": "Dead last finish is greater than did not finish, which trumps did not start.",
        "author": "Anonymous"
    }]
};

//3.
motivation = {
    "quotecategory": "motivation",
    "quotes": [{
        "quote": "Training gives us an outlet for suppressed energies created by stress and thus tones the spirit just as exercise conditions the body.",
        "author": "Arnold Schwarzenegger"
    }, {
        "quote": "Strength does not come from the physical capacity. It comes from an indomitable will.",
        "author": "Ghandi"
    }, {
        "quote": "Your body can stand almost anything. It’s your mind that you have to convince.",
        "author": "Anonymous"
    }, {
        "quote": "Fitness is like a relationship. You can’t cheat and expect it to work.",
        "author": "Anonymous"
    }, {
        "quote": "Dead last finish is greater than did not finish, which trumps did not start.",
        "author": "Anonymous"
    }]
};

//4.
love = {
    "quotecategory": "love",
    "quotes": [{
        "quote": "Training gives us an outlet for suppressed energies created by stress and thus tones the spirit just as exercise conditions the body.",
        "author": "Arnold Schwarzenegger"
    }, {
        "quote": "Strength does not come from the physical capacity. It comes from an indomitable will.",
        "author": "Ghandi"
    }, {
        "quote": "Your body can stand almost anything. It’s your mind that you have to convince.",
        "author": "Anonymous"
    }, {
        "quote": "Fitness is like a relationship. You can’t cheat and expect it to work.",
        "author": "Anonymous"
    }, {
        "quote": "Dead last finish is greater than did not finish, which trumps did not start.",
        "author": "Anonymous"
    }]
};

// truth
getQuotes = (quoteObj) => {
    let n = quoteObj.length;
    var output = '';
    for (let i = 0; i < n; i++) {
        // console.log((i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author);
        output += ('<p style="color:red;font-size:22;">' + (i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author + '</p' + "\n");
    }
    return output
}

/*
format the querry as 2.1.1 bellow.
N/B: replace getQuotes with the name you'll call it with
    i.e nameToCallWith = require(./thequotes.js)
    And object name with object intended to call
    i.e nameToCallWith(objectIntendedToCall.quotes)

2.1.1 ...................................................................
getQuotes = require(./thequotes.js)
getQuotes(Programming.quotes)
*/
module.exports = getQuotes;