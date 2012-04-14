var max = function(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
};

var notes = { a: 10, b: 12, c: 1, d: 3, e: 5, f: 6, g: 8 };
var re = /^([a-g])([b#]?)(\d+)$/;

var getPitch = function(p) {
    var match = p.toLowerCase().match(re);
    var n, a, o, result = 0;

    if (match) {
        n = match[1]; // note
        a = match[2]; // bemol or sharp
        o = match[3]; // octave

        result = notes[n];
        if (a) {
            if (a === "b") {
                --result;
            } else if (a === "#") {
                ++result;
            }
        }
        result = result + 11 + (12 * parseInt(o));
    }
    return result;
}

var compile = function(musexpr) {
    var result = [];

    var calc = function(node, startNote) {
        var endLeft, endRight;

        if (node.tag === "note") {
            result.push( { tag: 'note', pitch: getPitch(node.pitch), start: startNote, dur: node.dur } );
            return (startNote + node.dur);

        } else if (node.tag === "rest") {
            return (startNote + node.duration);

        } else if (node.tag === "par") {
            endLeft = calc(node.left, startNote);
            endRight = calc(node.right, startNote);
            return max(endLeft, endRight);

        } else if (node.tag === "seq") {
            startNote = calc(node.left, startNote);
            return calc(node.right, startNote);

        }
    };

    calc(musexpr, 0);
    return result;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'note', pitch: 'a3', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 500 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c3', dur: 300 },
         right: 
          { 
            tag: 'seq',
            left: { tag: 'rest', duration: 500 },
            right:
             { 
               tag: 'par',
               left: { tag: 'note', pitch: 'e3', dur: 500 },
               right: { tag: 'note', pitch: 'f4', dur: 250 } 
             } 
          }
        }
};

console.log(melody_mus);
console.log(compile(melody_mus));

console.log("a0 = " + getPitch("a0"));
console.log("a1 = " + getPitch("a1"));
console.log("a#3 = " + getPitch("a#3"));
console.log("ab3 = " + getPitch("ab3"));
