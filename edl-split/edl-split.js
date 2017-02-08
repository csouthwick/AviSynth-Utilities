function convertEdl() {
    var join = document.getElementById("join").checked;
    var stills = document.getElementById("stills").checked;
    var crop = document.getElementById("crop").checked;
    var input = document.getElementById("input").value;
    var frames = [];
    var pat = /C +(\d+)/g;

    var match = pat.exec(input);
    while (match != null) {
        frames.push(match[1]);
        match = pat.exec(input);
    }

    var output = "";

    for (var i = 0; i < frames.length; i++) {
        if (join) {
            output += "c" + i + "=";
        } else {
            output += "#~ ";
        }

        output += "Trim(" + frames[i] + ", ";
        if (stills) {
            output += "-1)";
        } else if (i < (frames.length - 1)) {
            output += frames[i + 1] + "-1)";
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
        for (var i = 0; i < frames.length; i++) {
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
