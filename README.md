# AviSynth Utilities
Small utility pages that I've written to help create [AviSynth](http://avisynth.nl/) scripts. These were created for my own personal use to automate some of the repetetive tasks I encountered while editing video with AviSynth and as such are rather spartan.

##[IfoEdit CellTimes to x264 qpf and ogg chapters](https://csouthwick.github.io/AviSynth-Utilities/dvd-chapters/)
Takes in a DVD CellTimes file from [IfoEdit](http://www.ifoedit.com/) for accurate timing information and provides an editing interface to delete unwanted video cells, merge cells into chapters for when chapters are split over multiple cells, adjusting for hard or soft telecined video, and providing chapter names. Output is an ogg chapter file and an x264 qp file. Instructions are provided with each step of the process.

##[Split](https://csouthwick.github.io/AviSynth-Utilities/split/)
Takes a sequence of frame numbers to split up a video, similar in concept to using the razor tool in Adobe Premiere. This is especially useful for applying filters to specific sections of a video or in cases where the parameters may vary in different parts.

 * Join - should be selected if the video is to be kept whole for exporting. If not selected, the output will be a bunch of commented out clips to be exported individually.
 * Still images  - check to keep only the individual frames specified. Useful for creating a bunch of screen capture images at once.
 * Add crop(0,0,0,0) - as implied, this adds the [crop](http://avisynth.nl/index.php/Crop) function to the end of each clip. This is handy for older video sources (especially analog sources) with black borders on the sides that vary in size. Note that when joining clips they must all have the same dimensions, so it may be necessary to add a [resizer](http://avisynth.nl/index.php/Resize) after cropping.

##[EDL Split](https://csouthwick.github.io/AviSynth-Utilities/edl-split/)
A variation of Split which extracts the start frames from an [edit decision list](https://en.wikipedia.org/wiki/Edit_decision_list) (edl) file exported from Premiere. The goal here was to have Premiere keep track of which frames to split on instead of manually keeping track of a list of frames. As only the start frames are used, trimming, multiple source files, and other features of the edl format are not supported - although they may be in future versions. Premiere must be switched to display the timeline in frames instead of using a timecode before exporting the edl file as AviSynth does not support timecode based editing.

##[Crop Tweener](https://csouthwick.github.io/AviSynth-Utilities/crop-tweener/)
Used as one of the last steps in dealing with older videos from analog sources that have black bars on the sides that vary in width.

1. Create a list of start frames of cuts as well as the start and end points of fades where the crop values will differ. This can either be done by manually copying down the frame numbers or by using the razor tool in Premiere.
2. Use either Split or EDL Split from above to create clips that can be adjusted independently. "Add crop(0,0,0,0)" should be selected.
3. Go through each resulting clip and adjust the crop values as needed. If a clip does not need any cropping, leave ".crop(0,0,0,0)" in place. Remove ".crop(0,0,0,0)" from any clip that fades or uses some other transition between two differently cropped clips. This is what tells Crop Tweener which clips need to be animated with a zoom in or zoom out to realign the clips.
4. Copy and paste all of that into Crop Tweener's input box, fill out the Desired Resolution section, and press Go.

##[AVS Clip Exporter](https://csouthwick.github.io/AviSynth-Utilities/avs-clip-exporter/)
Takes in the name of a source AviSynth script and a series of commented out Trim() statements produced by Split or EDL Split (without the Join option) and creates an individual avs file for each bundled up in a zip file. Uses [zip.js](http://gildas-lormeau.github.io/zip.js/) from [Gildas Lormeau](https://github.com/gildas-lormeau) with [zlib-asm](https://github.com/ukyo/zlib-asm) from [Syu Kato](https://github.com/ukyo).
