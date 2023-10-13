function loadTextures(_texturePack, _size){
  let assets = [];
  for(let i=0; i<_texturePack.width; i+= _size[0]){
    let newAsset = _texturePack.get(i, 0, _size[0], _size[1]);
    assets.push(newAsset);
  }
  return assets;
}