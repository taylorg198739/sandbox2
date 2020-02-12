/**
 * @param height The height of the (vertical parts of) isometric grid cells
 * @returns A function mapping from [x,y,z] to [x,y].
 */
export const convert = function (height: number) {
  return ([x, y]: [number, number]): [number, number] => [
    (x - y) * height * Math.sqrt(3) / 2,
    (x + y) * height / 2
  ];
};

