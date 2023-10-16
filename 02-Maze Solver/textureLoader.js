function loadTextures(_texturePack, _size){
  let assets = [];
  for(let j=0; j<_texturePack.height; j+= _size[1]){
    for(let i=0; i<_texturePack.width; i+= _size[0]){
      let newAsset = _texturePack.get(i, j, _size[0], _size[1]);
      assets.push(newAsset);
    }
  }
  return assets;
}