function createTrim() {
    var join = document.getElementById("join").checked;
    var stills = document.getElementById("stills").checked;
    var crop = document.getElementById("crop").checked;
    var input = document.getElementById("input").value.match(/\d+/g);
    if (!stills) {
        input.push("0");
    }
    input.sort(function (a, b) {
        return a - b;
    });
    var output = "";

    for (var i = 0; i < input.length; i++) {
        if (join) {
            output += "c" + i + "=";
        } else {
            output += "#~ ";
        }

        output += "Trim(" + input[i] + ", ";
        if (stills) {
            output += "-1)";
        } else if (i < (input.length - 1)) {
            output += input[i + 1] + "-1)";
        } else {
            output += "0)";
        }

        if (crop) {
            output += ".crop(0,0,0,0)";
        }

        output += "\n";
    }

    if (join) {
        output += "\n";
        for (var i = 0; i < input.length; i++) {
            if (i % 10 === 0 && i !== 0) {
                output += "\n\\";
            }

            if (i === 0) {
                output += "c" + i;
            } else {
                output += "+c" + i;
            }
        }
    }

    document.getElementById("output").value = output;
}
