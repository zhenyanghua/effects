export const random = (max) => Math.random() * Math.floor(max);
export const randomRange = (min, max) => random(max - min) + min;