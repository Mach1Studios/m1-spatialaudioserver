##!/usr/bin/env bash

# echo "lol you run me" >> /share/sound/test.txt

# ffmpeg -analyzeduration 10M  -re -i /share/sound/m1-debug-visual.wav -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt
ffmpeg -analyzeduration 10M  -re -i /share/sound/$1 -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt

echo "I'm a response in bash from NGINX, you try to run a sound file through FFmpeg. Sound file is:"
echo "$1"
