//retrieve quotes and send them

//1.
Programming = {
    "quotecategory": "Programming",
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
Workout = {
    "quotecategory": "Workout",
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
Motivation = {
    "quotecategory": "Motivation",
    "quotes": [{
        "quote": "Our greatest glory is not in never falling, but in rising every time we fall.",
        "author": "Confucius"
    }, {
        "quote": "All our dreams can come true, if we have the courage to pursue them.",
        "author": "Walt Disney"
    }, {
        "quote": "Everything you’ve ever wanted is on the other side of fear.",
        "author": "George Addair"
    }, {
        "quote": "Where there is a will, there is a way. If there is a chance in a million that you can do something, anything, to keep what you want from ending, do it. Pry the door open or, if need be, wedge your foot in that door and keep it open.",
        "author": "Pauline Kael"
    }, {
        "quote": "Do not wait; the time will never be ‘just right.’ Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along.",
        "author": "George Herbert"
    }]
};

//4.
Love = {
    "quotecategory": "Love",
    "quotes": [{
        "quote": "Love takes off masks that we fear we cannot live without and know we cannot live within.",
        "author": "James Baldwin"
    }, {
        "quote": "Love is many things, none of them logical.",
        "author": "Princess Bride"
    }, {
        "quote": "I think we can both put our differences behind us. For science.",
        "author": "You monster"
    }, {
        "quote": "Ohana means family. Family means nobody gets left behind or forgotten.",
        "author": "Lilo and stitch"
    }, {
        "quote": "I knew when i met you an adventure was going to happen.",
        "author": "A.A. Milne"
    }]
};

// truth
getQuotes = (quoteObj) => {
    let n = quoteObj.length;
    var output = '';
    for (let i = 0; i < n; i++) {
        // console.log((i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author);
        output += ('<p style="color:#00d2b4; font-size:22; font-weight: bold;">' + (i + 1) + '.' + '"' + quoteObj[i].quote + '"' + ' ' + '-' + ' ' + quoteObj[i].author + '</p' + "\n");
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
