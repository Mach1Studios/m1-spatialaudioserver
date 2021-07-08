##!/usr/bin/env bash

# echo "lol you run me" >> /share/sound/test.txt

# that is a lot part of ffmpeg command
# ffmpeg -stream_loop 100 -analyzeduration 10M  -re -i /share/sound/m1-debug-visual.wav -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt
# ffmpeg -y -stream_loop -1 -i /share/sound/test.wav -af "channelmap=channel_layout=hexadecagonal" -c:a aac -ac 2 -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play"
# ffmpeg -y -stream_loop -1 -i /share/sound/$1 -af "channelmap=channel_layout=hexadecagonal" -c:a aac -ac 2 -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play"
# ffmpeg -stream_loop -1 -analyzeduration 10M  -re -i /share/sound/$1 -strict -2 -c:a libopus -mapping_family 255 -f flv rtmp://127.0.0.1/live/play >> /share/sound/test.txt
pkill ffmpeg

# split input into multi-mono for channel reordering
# TODO: switchcase for number of channels, this might only be important for 8 channel inputs
#ffmpeg -y -i /share/sound/$1 -map_channel 0.0.0 000.wav -map_channel 0.0.1 001.wav -map_channel 0.0.2 002.wav -map_channel 0.0.3 003.wav -map_channel 0.0.4 004.wav -map_channel 0.0.5 005.wav -map_channel 0.0.6 006.wav -map_channel 0.0.7 007.wav

# reorder channels for aac transcoding and use octogonal to preserve
# TODO: switchcase for number of channels, this might only be important for 8 channel inputs
#ffmpeg -y -i 006.wav -i 000.wav -i 001.wav -i 007.wav -i 004.wav -i 005.wav -i 002.wav -i 003.wav -filter_complex "[0:a][1:a][2:a][3:a][4:a][5:a][6:a][7:a]join=inputs=8:channel_layout=octagonal[a]" -map "[a]" MERGED-joinoctogonal.wav
#ffmpeg -y -stream_loop -1 -i MERGED-joinoctogonal.wav -af "channelmap=channel_layout=octagonal" -metadata comment='mach1spatial-8' -c:a aac -ac "${2:-8}" -b:a 1024k -f flv "rtmp://127.0.0.1:1935/live/play" >> /share/sound/test.txt

ffmpeg -y -stream_loop -1 -i /share/sound/$1 -c:a aac -ac "${2:-8}" -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/play" >> /share/sound/test.txt

echo "I'm a response in bash from NGINX, you try to run a sound file through FFmpeg. Sound file is:"
echo "${1:-test.wav}"
echo "Number of chanels: ${2:-2}"
