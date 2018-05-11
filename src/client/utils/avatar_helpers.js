export const createPlayerAvatar = (imgSrc) => {
  const sprite = new Image();
  sprite.src = imgSrc;
  //  #here - no onload since image is drawn on update();
  return sprite;
};

export default {
  createPlayerAvatar,
};
