#!/usr/bin/env bash

pkill ffmpeg

fileName="${1:-unknownfile}"
fileId="${2:-$(cat /proc/sys/kernel/random/uuid)}"
filePath="/share/sound/$fileName"

# if logs not exist > create them
if [[ ! -d "/share/sound/logs" && ! -L "/share/sound/logs" ]] ; then
    mkdir /share/sound/logs
fi

log () {
  local log_prefix="[$(cat /proc/sys/kernel/random/uuid)] INFO:"
  local log_file="/share/sound/logs/$fileName.log"

  echo "$log_prefix $1" &>> $log_file
}

log "transocder starting at $(date) for file=$fileName; id=$fileId"
rm -rf /opt/data/dash/$fileId.mpd && touch /opt/data/dash/$fileId.mpd

# trying to find out how many channels are in a selected file
channels=`ffprobe -i $filePath -show_entries stream=channels -select_streams a:0 -of compact=p=0:nk=1 -v 0`
layout='mono' # setting default channel layout
case $channels in
  2 )
    layout='stereo'
    ;;
  4 )
    layout='quad'
    ;;
  6 )
    layout='hexagonal'
    ;;
  8 )
    layout='octagonal'
    ;;
  16 )
    layout='hexadecagonal'
    ;;
  * )
    # FIXME: just stub, here, if everything works fine, should be remapping channels based on ffmpeg pan parameter: https://trac.ffmpeg.org/wiki/AudioChannelManipulation#Remapchannels
    layout='mono'
    ;;
esac

log "Number of channels: $channels"
log "Type of channels layout: $layout"

# ffmpeg -y -stream_loop -1 -i $filePath -c:a aac -af "channelmap=channel_layout=octagonal" -b:a 2048k -f flv "rtmp://127.0.0.1:1935/live/$fileId" &>> "/share/sound/logs/ffmpeg.output"
# ffmpeg -y -i $filePath -c:a aac -af "channelmap=channel_layout=octagonal" -b:a 2048k -f mp4 "/share/sound/$fileId" &>> "/share/sound/logs/ffmpeg.output"
ffmpeg -y -i $filePath -strict -2 -c:a libopus -mapping_family 255 -b:a 2048k -af "channelmap=channel_layout=octagonal" -f dash "/share/sound/content/$fileId.mpd" &>> "/share/sound/logs/ffmpeg.output"
