
var alphabet = {

    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false

};


function isIsogram(str) {

    var myString = [];
    
    // 1. capture the letters in the string 

    for (var i = 0; i < str.length; i++) {
        
        myString.push(str.charAt(i));

        // 2. assign each letter that is found in the string an alphabet ID number (boolean?)

        // 3. check if that ID number occurs more than once

        // 4. wrap the whole thing in a function that ignores the letters CASE

        console.log([i]);

    };

    myString.forEach(identifyCharacters(myString));

    console.log(myString);
};

function identifyCharacters(arr) {
    
    switch (arr) {
        case "a":
            alphabet.a = true;
            console.log(alphabet.a);

    }
}

// test

isIsogram("caboose");