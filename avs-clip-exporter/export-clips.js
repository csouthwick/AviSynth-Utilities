function AviSynthScript(avs, clips) {
    var avsStr = "Import(\"..\\" + avs + ".avs\")\n\n";
    var clips = clips;
    this.clipCount = clips.length;
    this.clip = function (n) {
        var temp = avsStr;
        var i;
        for (i = 0; i < clips.length; i++) {
            if (i != n) {
                temp += "#~ ";
            }
            temp += clips[i] + "\n";
        }
        return temp;
    };
}

function createZip() {
    var avs = document.getElementById("sourceAvs").value;
    var clips = document.getElementById("input").value.replace(/#~ /g, "").split("\n");
    var avsScript = new AviSynthScript(avs, clips);

    var myZip = new zip.fs.FS();
    myZip.root.addDirectory("Scenes");
    var i;
    console.log(avsScript.length);
    for (i = 0; i < avsScript.clipCount; i++) {
        var contents = avsScript.clip(i).replace(/\n/g, "\r\n");
        myZip.root.children[0].addText("Scene " + (i + 1) + ".avs", contents);
    }
    myZip.exportBlob(function (zipBlob) {
        var zipUrl = URL.createObjectURL(zipBlob);
        var fname = "Scenes.zip";

        var output = "<a href=\"" + zipUrl + "\" download=\"" + fname + "\">" + fname + "</a>";
        document.getElementById("output").innerHTML = output;
    });
}
