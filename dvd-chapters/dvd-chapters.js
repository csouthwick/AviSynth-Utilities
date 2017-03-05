var transitionTime = 300;

function loadCellTimesFile() {
    //Check if there is a file
    if (!document.getElementById("cellTimesFile").files) {
        return;
    }
    //Create FileReader
    var cellTimesFile = document.getElementById("cellTimesFile").files[0];
    var reader = new FileReader();
    reader.addEventListener("loadend", function () {
        //Put file contents into cellTimes text box
        document.getElementById("cellTimes").value = reader.result;
        //Validate file contents
        validate();
    });
    //Read file
    reader.readAsText(cellTimesFile);
}

/* Enable next button if there is at least one number and it isn't 0,
 * otherwise disable*/
function validate() {
    var test = document.getElementById("cellTimes").value.match(/\d+/g);
    if (test !== null && test !== "0") {
        document.getElementById("importBtn").disabled = false;
    } else {
        document.getElementById("importBtn").disabled = true;
    }
}

function importCells() {
    //Find all numbers in input and put them in an array
    var i, cRow, cell1, cell2, cell3;
    var cellTimes = document.getElementById("cellTimes").value;
    var cells = [];
    var patt = /\d+/g;
    var match;
    while ((match = patt.exec(cellTimes)) !== null) {
        cells.push(parseInt(match));
    }

    //Set up the table to allow cells to be deleted
    var deleteCellsEditor = document.getElementById("deleteCellsEditor").tBodies[0];
    for (i = 0; i < cells.length; i++) {
        cRow = deleteCellsEditor.insertRow(-1);
        cell1 = cRow.insertCell(0); //Checkbox
        cell2 = cRow.insertCell(1); //Cell number
        cell3 = cRow.insertCell(2); //Individual cell duration (not cumulative)
        cell1.innerHTML = "<input type=\"checkbox\" checked=\"checked\" onchange=\"toggleCheckedStyle(this)\"/>";
        cell2.innerHTML = (i + 1);
        //IfoEdit Celltimes are cumulative sums
        if (i === 0) {
            //Leave first cell duration as is because no cells come before it
            cell3.innerHTML = cells[i];
        } else {
            //Subtract previous IfoEdit Celltime to get individual cell duration
            cell3.innerHTML = cells[i] - cells[i - 1];
        }
        //Add event listener so entire row is clickable to toggle cell
        cRow.addEventListener("click", toggleCheck, false);
    }

    //Switch to the table once it's populated
    switchTo("deleteCells");
}

/*For making entire row clickable to toggle the checkbox*/
function toggleCheck(e) {
    //Make sure click event did NOT occur on the checkbox to avoid interfering
    //with its default operation. Otherwise the checkbox will be toggled TWICE
    if (e.target.tagName != "INPUT") {
        var cb = this.cells[0].children[0];
        if (!cb.disabled) {
            //Toggle the checkbox
            cb.checked = !cb.checked;
            //Manually call the onchange event as changing values via JavaScript
            //does not automatically trigger the event
            cb.onchange();
        }
    }
}

/* Called by the checkbox's onchange event to add or remove the unchecked class
 * to the table row based on the checked state*/
function toggleCheckedStyle(checkbox) {
    if (!checkbox.checked) {
        checkbox.parentNode.parentNode.className = "unchecked";
    } else {
        checkbox.parentNode.parentNode.className = "";
    }
}

function saveDeletions() {
    var i;
    //Get the active cells from the deleteCellsEditor and convert them from
    //cell durations into the start frame of each cell
    var cellRows = document.getElementById("deleteCellsEditor").tBodies[0].rows;
    //Keep track of the source cell number so user can use it as a reference via
    //matching it with the cell numbers displayed in DVD Decrypter
    var outputCellNums = [];
    var outputCells = [];
    //Keep track of what the current cell start frame is
    var currentFrame = 0; //Count starts from frame 0

    for (i = 0; i < cellRows.length; i++) {
        //Only add the cell if its checkbox is checked
        if (cellRows[i].cells[0].children[0].checked) {
            //Push source cell number onto array
            outputCellNums.push(cellRows[i].cells[1].innerHTML);
            //Push current frame number into array
            outputCells.push(currentFrame);
            //Add the duration of the current cell to the currentFrame counter
            //This will become the start frame of the next active cell
            currentFrame += parseInt(cellRows[i].cells[2].innerHTML);
        }
    }

    //Set up the table to allow cells to be merged
    var disableCheckbox, cRow, cell1, cell2, cell3, cell4;
    var mergeCellsEditor = document.getElementById("mergeCellsEditor").tBodies[0];
    for (i = 0; i < outputCells.length; i++) {
        disableCheckbox = "";
        //The first checkbox of the first cell needs to be disabled as there is
        //no previous cell for it to merge with
        if (i === 0) {
            disableCheckbox = "disabled=\"disabled\" ";
        }
        cRow = mergeCellsEditor.insertRow(-1);
        cell1 = cRow.insertCell(0); //checkbox
        cell2 = cRow.insertCell(1); //Source cell number for reference in DVD Decrypter
        cell3 = cRow.insertCell(2); //Chapter number
        cell4 = cRow.insertCell(3); //Start frame of the cell
        cell1.innerHTML = "<input type=\"checkbox\" checked=\"checked\" " + disableCheckbox + "onchange=\"cellMerge(this)\"/>";
        cell2.innerHTML = outputCellNums[i];
        cell3.innerHTML = (i + 1);
        cell4.innerHTML = outputCells[i];
        //Add event listener so entire row is clickable to toggle cell
        cRow.addEventListener("click", toggleCheck, false);
    }

    //Switch to the table once it's populated
    switchTo("mergeCells");
}

function cellMerge(checkbox) {
    var i;
    //Toggle the class on the table row to match the checkbox state
    toggleCheckedStyle(checkbox);
    var cellRows = document.getElementById("mergeCellsEditor").tBodies[0].rows;
    //Store chapter counter outside loop
    var chapNum = 1;

    for (i = 0; i < cellRows.length; i++) {
        if (cellRows[i].cells[0].children[0].checked) {
            //If cell is enabled, give it a chapter number
            cellRows[i].cells[2].innerHTML = chapNum;
            //and increase chapter count
            chapNum++;
        } else {
            //else blank out the cell for the chapter number
            cellRows[i].cells[2].innerHTML = "";
        }
    }
}

function saveMerge() {
    var i;
    //Get start frames of each chapter from the mergeCellsEditor table
    var cellRows = document.getElementById("mergeCellsEditor").tBodies[0].rows;
    var outputChapters = [];

    for (i = 0; i < cellRows.length; i++) {
        //Only get checked cells
        if (cellRows[i].cells[0].children[0].checked) {
            //Get start frame number of chapter
            outputChapters.push(cellRows[i].cells[3].innerHTML);
        }
    }

    var cRow, cell1, cell2, cell3, cell4;
    //Set up the chapterEditor table
    var chapterEditor = document.getElementById("chapterEditor").tBodies[0];
    //Video standard (NTSC or PAL) is needed to convert frames into timecodes
    var vStandard = document.getElementById("vStandard").value;
    for (i = 0; i < outputChapters.length; i++) {
        cRow = chapterEditor.insertRow(-1);
        cell1 = cRow.insertCell(0); //Chapter number
        cell2 = cRow.insertCell(1); //Chapter name
        cell3 = cRow.insertCell(2); //Frame chapter starts on
        cell4 = cRow.insertCell(3); //Timecode chapter starts on
        cell1.innerHTML = (i + 1);
        //Create default chapter names
        cell2.innerHTML = "<input type=\"text\" value=\"Chapter " + (i + 1) + "\"/>";
        cell3.innerHTML = outputChapters[i];
        //need to pass in both the frame number and the video standard to create timecode
        cell4.innerHTML = frameToTimecode(parseInt(outputChapters[i]), vStandard);
    }

    //Switch to the table once it's populated
    switchTo("editChapters");
}

/*Called when either the video standard is changed or when decimation is toggled*/
function updateFramerate() {
    var i;
    //Frame numbers in the chapterEditor might have been decimated/modified, so
    //it is important to get the source frames from the mergeCellsEditor instead
    var cellRows = document.getElementById("mergeCellsEditor").tBodies[0].rows;
    var frames = [];

    for (i = 0; i < cellRows.length; i++) {
        //Only get checked cells
        if (cellRows[i].cells[0].children[0].checked) {
            //Get start frame number of chapter
            frames.push(parseInt(cellRows[i].cells[3].innerHTML));
        }
    }

    //Get the currently selected video standard (NTSC or PAL)
    var vStandard = document.getElementById("vStandard").value;
    //Decimation controls are shown or hidden via a css class set to the video standard
    document.getElementById("editChapters").className = vStandard;
    //Check if decimation is enabled
    var decimate = document.getElementById("decimate").checked;
    //If the video standard is NTSC and decimation is enabled
    if (vStandard === "NTSC" && decimate) {
        //Set the video standard to film
        vStandard = "FILM";
        //Run m in n decimation on the frame numbers
        for (i = 0; i < frames.length; i++) {
            frames[i] = decimateFrame(frames[i]);
        }
    }

    //Update the frame number and timecode columns of the chapterEditor
    var chapterEditor = document.getElementById("chapterEditor").tBodies[0].rows;
    for (i = 0; i < frames.length; i++) {
        //Update frame numbers
        chapterEditor[i].cells[2].innerHTML = frames[i];
        //Update timecodes - need to pass in both the frame number and the video standard
        chapterEditor[i].cells[3].innerHTML = frameToTimecode(frames[i], vStandard);
    }
}

function saveOutput() {
    var i;
    //Get title to use for filename if it exists, use "Chapters" instead if it was blank
    var title = document.getElementById("title").value || "Chapters";
    var chapterEditor = document.getElementById("chapterEditor").tBodies[0].rows;
    //String to build up x264 qp file
    var x264qpf = "";
    //String to build up ogg chapter file
    var oggChapters = "";

    //For each chapter...
    for (i = 0; i < chapterEditor.length; i++) {
        //add frame number to x264 qp file
        x264qpf += chapterEditor[i].cells[2].innerHTML + " K\n";
        //add chapter timecode to ogg chapter file
        oggChapters += "CHAPTER" + pad(i + 1, 2);
        oggChapters += "=" + chapterEditor[i].cells[3].innerHTML + "\n";
        //add chapter name to ogg chapter file
        oggChapters += "CHAPTER" + pad(i + 1, 2);
        oggChapters += "NAME=" + chapterEditor[i].cells[1].children[0].value + "\n";
    }

    //If the browser supports the blobconstructor and bloburls,
    //make downloadable files,
    //else put the x264qpf and oggChapters strings in readonly textareas
    if (Modernizr.blobconstructor && Modernizr.bloburls) {
        var qpfDlLink = document.getElementById("qpfDownload");
        var oggDlLink = document.getElementById("oggChaptersDownload");

        //Pass in anchor element, filename, and file content string
        makeDownload(qpfDlLink, title + ".qpf", x264qpf);
        makeDownload(oggDlLink, title + ".txt", oggChapters);
    } else {
        document.getElementById("qpfText").value = x264qpf;
        document.getElementById("oggChaptersText").value = oggChapters;
    }

    //Switch to output area when downloads or textareas are ready
    switchTo("output");
}

function frameToTimecode(frame, framerateStr) {
    //Framerate numerator in whole frames
    var num;
    //Framerate denominator in milliseconds instead of seconds to avoid float rounding errors
    var den;
    switch (framerateStr) {
        case "NTSC":
            num = 30;
            den = 1001;
            break;
        case "PAL":
            num = 25;
            den = 1000;
            break;
        case "FILM":
            num = 24;
            den = 1001;
            break;
    }

    //Using the Date object makes it easy to convert to h:m:s.ms format
    //Normally timecode in seconds = frame * seconds per frame (aka divide by
    //framerate), but the date object requires the input in milliseconds. Doing
    //that out would be ms = frames * 1000 * seconds per frame, but a 1.001 den
    //for NTSC and FILM would introduce float rounding errors. So the den is
    //pre-multiplied by 1000 for use in this equation, but the num is left alone
    var time = new Date(Math.floor(frame * den / num));
    //pad function pads number with 0's as needed for use in string
    var h = pad(time.getUTCHours(), 2);
    var m = pad(time.getUTCMinutes(), 2);
    var s = pad(time.getUTCSeconds(), 2);
    var ms = pad(time.getUTCMilliseconds(), 3);

    return h + ":" + m + ":" + s + "." + ms;
}

function decimateFrame(frame, m, n) {
    //Assume 1 in 5 decimation unless specified otherwise
    m = m || 1;
    n = n || 5;

    //Multiply frame by decimation ratio and round it to get the integer value
    //that should be subtracted from the original frame number
    //This seems to match MeGUI's chapter editor qpf output, but might by off by
    //a frame depending on the decimation pattern of the source video.
    //Note that this should never be off by more than a single frame as each
    //frame is individually calculated so any error cannot accumulate
    var temp = Math.round(frame * m / n);
    return frame - temp;
}

/* Simple padding function that takes in a value n, the desired width, and
 * optionally the character that should be used for padding - default is 0*/
function pad(n, width, z) {
    //Optional padding character or default 0
    z = z || '0';
    //Convert value to string if not already
    n = n + '';
    //Return n as is if >= width, else
    //create array with width + 1 - n.length undefined elements, join the
    //undefined elements into a string using padding character as a separator,
    //and finally concatinate it with the value n
    return n.length >= width ? n : new Array(width + 1 - n.length).join(z) + n;
}

/*Switch sections with a fade transition*/
function switchTo(classStr) {
    //Fade the wrapper container, not individual elements
    var wrapper = document.getElementById("wrapper");
    //If the browser doesn't support csstransitions, us JavaScript alternative
    if (!Modernizr.csstransitions) {
        jsFadeOut(wrapper, transitionTime);
    } else {
        //add the class, let the css take care of the fade
        wrapper.className += " fadeOut";
    }

    //After the fadeout is finished
    setTimeout(function () {
        var wrapper = document.getElementById("wrapper");
        //Set the wrapper class to the destination section and let the css take
        //care of hiding/showing things and fading back in on its own
        wrapper.className = classStr;
        //Use JavaScript alternative if browser doesn't support csstransitions
        if (!Modernizr.csstransitions) {
            jsFadeIn(wrapper, transitionTime);
        }
    }, transitionTime);
}

function resetAll() {
    document.getElementById("cellTimesFile").value = "";
    document.getElementById("cellTimes").value = "";
    document.getElementById("importBtn").disabled = true;

    clearTable(document.getElementById("deleteCellsEditor").tBodies[0]);
    clearTable(document.getElementById("mergeCellsEditor").tBodies[0]);

    switchTo("importCells");

    setTimeout(function () {
        document.getElementById("title").value = "";
        document.getElementById("decimate").checked = false;
        clearTable(document.getElementById("chapterEditor").tBodies[0]);

        if (Modernizr.blobconstructor && Modernizr.bloburls) {
            releaseDownload(document.getElementById("qpfDownload"));
            releaseDownload(document.getElementById("oggChaptersDownload"));
        } else {
            document.getElementById("qpfText").value = "";
            document.getElementById("oggChaptersText").value = "";
        }
    }, transitionTime);
}

function clearTable(chapterTableBody) {
    while (chapterTableBody.rows.length > 0) {
        chapterTableBody.deleteRow(chapterTableBody.rows.length - 1);
    }
}

function makeDownload(anchorElement, filename, contentStr) {
    //Make sure filename uses valid characters for Windows systems
    filename = filename.replace(/[\\\/:*?"<>|]/g, "_");
    anchorElement.download = filename; //Set the download name
    anchorElement.innerHTML = filename; //Set the link text

    //Create a new plain text file blob and make sure to us Windows style CRLF aka \r\n
    var fileBlob = new Blob([contentStr.replace(/\r?\n/g, "\r\n")], {type: "text/plain;charset=ANSI"});
    //Attach blob to the anchor element
    anchorElement.href = URL.createObjectURL(fileBlob);
}

function releaseDownload(anchorElement) {
    if (anchorElement.href != "") {
        URL.revokeObjectURL(anchorElement.href);
        anchorElement.removeAttribute("href");
        anchorElement.removeAttribute("download");
        anchorElement.innerHTML = "";
    }
}
