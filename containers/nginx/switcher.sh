#!/usr/bin/env bash

fileName="${1:-unknownfile}"
fileId="${2:-$(cat /proc/sys/kernel/random/uuid)}"
filePath="/share/sound/$fileName"

isLoop="${3:-false}"

# if logs or preload are not exist > create them
if [[ ! -d "/share/sound/logs" && ! -L "/share/sound/logs" ]] ; then
    mkdir /share/sound/logs
fi
# used for dash chanks
if [[ ! -d "/share/sound/preload" && ! -L "/share/sound/preload" ]] ; then
    mkdir /share/sound/preload
fi

log () {
  local log_prefix="[$(cat /proc/sys/kernel/random/uuid)] INFO:"
  local log_file="/share/sound/logs/$fileName.log"

  echo "$log_prefix $1" &>> $log_file
}

log "transocder starting at $(date) for file=$fileName; id=$fileId; live=$isLoop"

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

if [[ "$isLoop" == true ]]; then
  log "starting live stream rtsp"
  rm -rf /opt/data/dash/$fileId.mpd && touch /opt/data/dash/$fileId.mpd

  ffmpeg -y -stream_loop -1 -i $filePath -c:a aac -af "channelmap=channel_layout=$channels" -b:a 2048k \
    -f flv "rtmp://127.0.0.1:1935/live/$fileId" &>> "/share/sound/logs/ffmpeg.live.output"
else
  log "creating static mpeg-dash manifest for the sound file"
  if [[ ! -d "/share/sound/preload/$fileId" && ! -L "/share/sound/preload/$fileId" ]] ; then
      mkdir -p -m 777 /share/sound/preload/$fileId

      ffmpeg -y -i $filePath -strict -2 -c:a libopus -mapping_family 255 -b:a 2048k -af "channelmap=channel_layout=octagonal" \
        -f dash "/share/sound/preload/$fileId/manifest.mpd" &>> "/share/sound/logs/ffmpeg.output"
  fi
fi
