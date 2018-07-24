export const generateArrayFromMapObject = (mapObject => (
  Object.keys(mapObject).map((key) => {
    const data = mapObject[key];
    return { x: data.row, y: data.col, data };
  })
));

export default {
  generateArrayFromMapObject,
};
