# AviSynth Utilities
Small utility pages that I've written to help create [AviSynth](http://avisynth.nl/) scripts. These were created for my own personal use to automate some of the repetetive tasks I encountered while editing video with AviSynth and as such are rather spartan.

##[Split](https://csouthwick.github.io/AviSynth-Utilities/split/)
Takes a sequence of frame numbers to split up a video, similar in concept to using the razor tool in Adobe Premiere. This is especially useful for applying filters to specific sections of a video or in cases where the parameters may vary in different parts.

 * Join - should be selected if the video is to be kept whole for exporting. If not selected, the output will be a bunch of commented out clips to be exported individually.
 * Still images  - check to keep only the individual frames specified. Useful for creating a bunch of screen capture images at once.
 * Add crop(0,0,0,0) - as implied, this adds the [crop](http://avisynth.nl/index.php/Crop) function to the end of each clip. This is handy for older video sources (especially analog sources) with black borders on the sides that vary in size. Note that when joining clips they must all have the same dimensions, so it may be necessary to add a [resizer](http://avisynth.nl/index.php/Resize) after cropping.

##[EDL Split](https://csouthwick.github.io/AviSynth-Utilities/edl-split/)
A variation of Split which extracts the start frames from an [edit decision list](https://en.wikipedia.org/wiki/Edit_decision_list) (edl) file exported from Premiere. The goal here was to have Premiere keep track of which frames to split on instead of manually keeping track of a list of frames. As only the start frames are used, trimming, multiple source files, and other features of the edl format are not supported - although they may be in future versions. Premiere must be switched to display the timeline in frames instead of using a timecode before exporting the edl file as AviSynth does not support timecode based editing.
