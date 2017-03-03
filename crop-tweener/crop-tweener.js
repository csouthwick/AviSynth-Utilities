function cleanMatch(match) {
    var output = [];
    output.push(parseInt(match[1]));
    output.push(parseInt(match[2]));
    if (typeof match[3] == "string") {
        output.push(match[3]);
    }
    return output;
}

function process() {
    var pat = /Trim\((\d+), (\d+)(?:-1)?\)(?:\.crop\((.*)\))?/g;
    var input = document.getElementById("input").value;
    var w = document.getElementById("width").value;
    var h = document.getElementById("height").value;
    var dim = w + "," + h;
    var lines = [];

    var match = pat.exec(input);
    while (match != null) {
        lines.push(cleanMatch(match));
        match = pat.exec(input);
    }

    var output = "";
    var i;
    for (i = 0; i < lines.length; i++) {
        output += "#~ c" + i + "=Trim(";
        output += lines[i][0] + ", ";
        output += lines[i][1];
        if (lines[i][1] != 0) {
            output += "-1";
        }
        output += ")";

        if (lines[i].length == 3) {
            if (lines[i][2] != "0,0,0,0") {
                output += ".crop(" + lines[i][2] + ")";
            }
            output += ".LanczosResize(" + dim + ")\n";
        } else {
            output += ".Animate(0," + (lines[i][1] - lines[i][0] - 1);
            output += ", \"LanczosResize\", ";
            output += dim + "," + lines[i - 1][2] + ", ";
            output += dim + "," + lines[i + 1][2] + ")\n";
        }
    }

    output += "\n#~ ";
    for (var i = 0; i < lines.length; i++) {
        if (i % 10 === 0 && i !== 0) {
            output += "\n#~ \\";
        }

        if (i === 0) {
            output += "c" + i;
        } else {
            output += "+c" + i;
        }
    }

    document.getElementById("output").value = output;
}
