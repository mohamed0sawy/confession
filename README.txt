OUR STORY — SETUP NOTES
========================

Files:
  index.html   -- structure/markup only
  styles.css   -- all visual styling
  script.js    -- all behavior/logic
  assets/      -- your video, music, image, photos

Open index.html in a browser to preview it right now -- it already
works with placeholders, so you can see the full flow (landing ->
video -> rotate-into-place -> album -> photos -> final page) before
adding your real files.

To make it yours:

1. INTRO VIDEO
   Save your video as:  assets/video.mp4
   It should end on the exact frame in assets/last-frame.png (the couple
   holding the blank album). If you regenerate the video, also update
   last-frame.png with the actual final frame so the flip transition
   lines up perfectly.

2. BACKGROUND MUSIC
   Save your track as:  assets/music.mp3

3. PHOTOS
   Drop your photos into assets/photos/ (1.jpg, 2.jpg, 3.jpg, ...) and
   open index.html in a text editor. Near the bottom of the <script>
   tag you'll find:

       const PHOTOS = [
         { src: "assets/photos/1.jpg", caption: "Where it all began" },
         ...
       ];

   Edit the captions, add or remove entries, or reorder them — that's
   the only place you need to touch to change what's in the album.

4. VIEWING IT
   Because this loads local video/audio/image files, open it with a
   local server rather than double-clicking the file, or some browsers
   will block the media. Easiest way (from inside this folder):

       python3 -m http.server 8000

   then visit http://localhost:8000 in your browser.

Nothing else needs to change — layout, animations, and transitions are
already wired up to whatever you put in PHOTOS and the assets folder.

5. ROTATE-PHONE PROMPT
   Since the video and album are shaped landscape, anything narrower
   than it is tall (portrait phones) sees a "turn your phone sideways"
   note instead of the story. This is driven purely by CSS in
   styles.css, so it can't silently fail to trigger:

       @media (orientation: portrait) and (max-width: 900px)

   If you want the cutoff at a different width, change the 900px there.
