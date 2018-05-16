export const createImage = (imgSrc) => {
  const imageObject = new Image();
  imageObject.src = imgSrc;

  // image is drawn on update() hence, no need for Image.onload
  return imageObject;
};

export default {
  createImage,
};
