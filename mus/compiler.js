var max = function(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
};

var compile = function(musexpr) {
    var result = [];

    var calc = function(node, startNote) {
        var endLeft, endRight;

        if (node.tag === "note") {
            result.push( { tag: 'note', pitch: node.pitch, start: startNote, dur: node.dur } );
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

