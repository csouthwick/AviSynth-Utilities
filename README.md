# AviSynth-Utilities
Small utility pages that I've written to help create AviSynth scripts

##Split
Takes a sequence of frame numbers to split up a video, similar in concept to using the razor tool in Adobe Premiere. This is especially useful for applying filters to specific sections of a video or in cases where the parameters may vary in different parts.

 * Join - should be selected if the video is to be kept whole for exporting. If not selected, the output will be a bunch of commented out clips to be exported individually.
 * Still images  - check to keep only the individual frames specified. Useful for creating a bunch of screen capture images at once.
 * Add crop(0,0,0,0) - as implied, this adds .crop(0,0,0,0) to the end of each clip. This is handy for older video sources (especially analog sources) with black borders on the sides that varies in size. Note that when joining clips they must all have the same dimensions, so it may be necessary to add a resizer after cropping.
