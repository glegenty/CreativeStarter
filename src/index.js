import raf from 'raf-loop'
import './styl/main.styl'
import scLoader from './components/scLoader'
import player from './components/playerElement'
import emitter from 'lib/emitter'
import audioSource from './components/audioSource'
// import visualizer from './components/visualizer'
// import scene from './components/scene'
import scene from './workshop/scene'

emitter.on('SUBMIT_URL', loadTracks)

const audio = audioSource(player.getPlayerElement())

raf(tick).start()

function loadTracks (tracksURL) {
  scLoader.loadSound(tracksURL).then((streamURL) => {
    player.setSource(streamURL)
      .play()
  })
}

function tick (dt = 0) {
  // visualizer.update(audio)
  scene.render()
}
