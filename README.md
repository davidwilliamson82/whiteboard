# whiteboard
<sub><sub>_Begin license text._<br />
Copyright 2019 DAVID WILLIAMSON<br />
<br />
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation<br />files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,<br />modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the<br />Software is furnished to do so, subject to the following conditions:<br />
<br />
The above copyright notice and this permission notice shall be included in all copies<br />or substantial portions of the Software.<br />
<br />
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE<br />WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR<br />COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,<br />ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br />
<br />
_End license text._</sub></sub><br />
<br />
<br />
If all you want to use is the whiteboard, **just download the index.html** and open it with your web browser.<br />
<br />
I like to use New Tab Redirect, along with a query parameter, specifying the name of the marks-data I am using.<br />
https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna?hl=en-US<br />
<br />
Photos are provided by Unsplash https://source.unsplash.com/
<br />
<br />
Here is a Youtube tutorial.<br />
https://www.youtube.com/embed/2RI41DfeWuQ<br />
<br />
TOOLS: <br />
&nbsp;&nbsp;P - paintbrush<br />
&nbsp;&nbsp;R - rectangle<br />
&nbsp;&nbsp;E - ellipse<br />
&nbsp;&nbsp;L - line<br />
&nbsp;&nbsp;T - text<br />
&nbsp;&nbsp;M - measure<br />
&nbsp;&nbsp;Z - zoom<br />
&nbsp;&nbsp;S - selection tool<br />
<br />
OTHER CONTROLS: <br />
&nbsp;&nbsp;H - instructions<br />
&nbsp;&nbsp;backtick, 0 - 9: select brushes, hold to set colors.<br />
&nbsp;&nbsp;&nbsp;&nbsp;the color palettes are arranged as follows:<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Left - paintbrush color<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Center - overlay color<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Right - grid color<br />
&nbsp;&nbsp;'-', '=' - adjust current brush width<br />
&nbsp;&nbsp;'\[', ']' - adjust font size<br />
&nbsp;&nbsp;F - toggle fill for shapes<br />
&nbsp;&nbsp;V - place vanishing point, hold down to scale grid units<br />
&nbsp;&nbsp;G - choose between no grid, a square grid, a triangular grid, and some time-management tools<br />
&nbsp;&nbsp;J - choose manner in which grid cells are outlined<br />
&nbsp;&nbsp;I - reset unsplash image<br />
&nbsp;&nbsp;Right-Click to save marks-data<br />
<br />
Ctrl:
&nbsp;&nbsp;constrains paintbrush to grid axes, or commits to straight line, if no grid is visible<br />
&nbsp;&nbsp;constrains rectangle and ellipse to 1x1 aspect ratio<br />
&nbsp;&nbsp;line to 15° increments<br />
&nbsp;&nbsp;Ctrl + Z: undo<br />
&nbsp;&nbsp;Ctrl + Y: redo<br />
&nbsp;&nbsp;Ctrl + C: copy selection<br />
&nbsp;&nbsp;Ctrl + X: cut selection<br />
&nbsp;&nbsp;Ctrl + V: paste selection<br />
<br />
Arrow Keys: <br />
&nbsp;&nbsp;Up constrains paintbrush to vertical<br />
&nbsp;&nbsp;Left constrains paintbrush to horizontal<br />
&nbsp;&nbsp;Down constrains to lines to and away from the vanishing point<br />
&nbsp;&nbsp;Right constrains to arcs about the vanishing point<br />
&nbsp;&nbsp;Forward Slash constrainst to lines parallel to the most recent line made with the paintbrush in committed constraint<br />
<br />
QUERY PARAMETERS: <br />
&nbsp;&nbsp;document-title<br />
&nbsp;&nbsp;screen-size<br />
&nbsp;&nbsp;board-size<br />
&nbsp;&nbsp;wallpaper-image<br />
&nbsp;&nbsp;overlay-color<br />
&nbsp;&nbsp;grid-type (two numbers, between 0 and 2, separated by 'x')<br />
&nbsp;&nbsp;problem-image<br />
&nbsp;&nbsp;marks-data<br />
&nbsp;&nbsp;fill-active<br />
<br 
HELPFUL FUNCTIONS: <br />
&nbsp;&nbsp;doExampleProblem(subject, upperLimit) // subject is either MATH or READING<br />
&nbsp;&nbsp;reading problems hit Merriam-Webster api https://dictionaryapi.com/products/api-learners-dictionary<br />
&nbsp;&nbsp;straightenGrid() will square the rectangular offset, set the hex grid to a 30 degree increment, and center the vanishing point.<br />
&nbsp;&nbsp;toggleWallpaperStyle() will make the wallpaper image cover the whole board, and sets it's backgroundAttachment to 'scroll'<br />
