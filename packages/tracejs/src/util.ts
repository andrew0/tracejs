export const average = (array: number[]): number => array.reduce((a, b) => a + b) / array.length;

export const zeros2D = (rows: number, cols: number): number[][] =>
  Array.from(Array(rows), (_) => Array(cols).fill(0));

export const zeros3D = (x: number, y: number, z: number): number[][][] =>
  Array.from(Array(x), (_) => {
    return Array.from(Array(y), (_) => Array(z).fill(0));
  });

export const copy2D = (arr: any[][]): any[][] => arr.map((x) => [...x]);

export const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max);

export const gauss = (mean: number, sd: number) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * sd + mean;
};
