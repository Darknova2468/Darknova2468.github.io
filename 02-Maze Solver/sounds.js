class Music{
  constructor(_music){
    this.music = _music;
  }
  play(_gameState, _wait){
    if(_wait){
      for(let i=0; i<this.music.length; i++){
        if(this.music[i].isPlaying()){ 
          this.music[i].setVolume(0.2);
        }
      }
    }
    else {
      let isPlaying = false;
      for(let i=0; i<this.music.length; i++){
        if(this.music[i].isPlaying()){ 
          if(i !== _gameState) {
            this.music[i].stop();
          }
          else{
            this.music[i].setVolume(0.8);
            isPlaying = true;
          }
          break;
        } 
      }
      if(!isPlaying){
        this.music[_gameState].play();
      }
    }
  }
}

class SFX{
  constructor(_sfx){
    this.sfx = _sfx;
  }
  play(_n){
    if(!this.sfx[_n].isPlaying()){
      this.sfx[_n].play();
    }
  }
}