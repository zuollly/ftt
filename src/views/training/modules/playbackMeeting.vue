<template>
  <div class="video-kingdom">
    <div id="videoPlayWrapper" style="width: 100%; height: 100%; border:5px solid #999;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: ['filePreseeUrl'],
  watch: {
    'filePreseeUrl': {
      handler(val) {
        var node = document.getElementById('videoPlayWrapper')
        // 如果有子节点  则删除重新插入新的视频节点
        if (node.hasChildNodes()) {
          removeAllChild('videoPlayWrapper')
        }
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `http://119.97.166.135:80/libs/swfplayer/player/sewise.player.min.js?server=vod&type=mp4&videourl=${this.filePreseeUrl}&autostart=true&starttime=0&lang=zh_CN&logo=http://onvod.sewise.com/libs/swfplayer/skin/images/logo.png&title=Vod Video&buffer=5&skin=vodWhite&fallbackurls=%7B%0A%09%22ogg%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.ogg%22%2C%0A%09%22webm%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.webm%22%0A%7D`
        document.getElementById('videoPlayWrapper').appendChild(script)
      },
      deep: true
    }
  },
  mounted() {
    var node = document.getElementById('videoPlayWrapper')
    // 如果有子节点  则删除重新插入新的视频节点
    if (node.hasChildNodes()) {
      removeAllChild('videoPlayWrapper')
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `http://119.97.166.135:80/libs/swfplayer/player/sewise.player.min.js?server=vod&type=mp4&videourl=${this.filePreseeUrl}&autostart=true&starttime=0&lang=zh_CN&logo=http://onvod.sewise.com/libs/swfplayer/skin/images/logo.png&title=Vod Video&buffer=5&skin=vodWhite&fallbackurls=%7B%0A%09%22ogg%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.ogg%22%2C%0A%09%22webm%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.webm%22%0A%7D`
    document.getElementById('videoPlayWrapper').appendChild(script)
  }
}
function removeAllChild(id) {
  var div = document.getElementById(id)
  while (div.hasChildNodes()) { // 当div下还存在子节点时 循环继续
    div.removeChild(div.firstChild)
  }
}
</script>
<style lang='scss' scoped>
.video-kingdom {
  width: 100%;
  height: 500px;
  position: relative;
  video,
  audio {
    width: 100%;
    height: 100%;
  }
  .play-from-begin {
    cursor: pointer;
    text-decoration-line: none;
    color: #ff8547;
  }
  .play-tips {
    position: absolute;
    bottom: 100px;
    left: 37px;
  }
  .play-tips-time {
    right: 15px;
    position: absolute;
    /* bottom: 0px; */
  }
}
</style>
