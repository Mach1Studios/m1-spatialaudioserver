##!/usr/bin/env bash

# echo "lol you run me" >> /share/sound/test.txt

# that is a lot part of ffmpeg command
# ffmpeg -stream_loop 100 -analyzeduration 10M  -re -i /share/sound/m1-debug-visual.wav -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt
# ffmpeg -y -stream_loop -1 -i /share/sound/test.wav -af "channelmap=channel_layout=hexadecagonal" -c:a aac -ac 2 -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play"
# ffmpeg -y -stream_loop -1 -i /share/sound/$1 -af "channelmap=channel_layout=hexadecagonal" -c:a aac -ac 2 -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play"
# ffmpeg -stream_loop -1 -analyzeduration 10M  -re -i /share/sound/$1 -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt
pkill ffmpeg

ffmpeg -y -stream_loop -1 -i /share/sound/$1 -c:a aac -ac "${2:-2}" -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play" >> /share/sound/test.txt

echo "I'm a response in bash from NGINX, you try to run a sound file through FFmpeg. Sound file is:"
echo "${1:-test.wav}"
echo "Number of chanels: ${2:-2}"
