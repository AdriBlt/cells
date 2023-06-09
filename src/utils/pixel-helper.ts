import * as p5 from 'p5';

import { Color } from './color';

export function setPixel(image: p5.Image, i: number, j: number, color: Color) {
    const index = 4 * (j + i * image.width);
    image.pixels[index + 0] = color.r;
    image.pixels[index + 1] = color.g;
    image.pixels[index + 2] = color.b;
    image.pixels[index + 3] = color.a !== undefined ? color.a : 255;
}