import { Color } from "three";

export const Colors = Object.freeze({
  foreground: hsl(330, 100, 71),
  background: hsl(0, 0, 0),
  card: hsl(0, 0, 96),
  cardForeground: hsl(0, 0, 100),
  accent: hsl(210, 100, 52),
  accentForeground: hsl(0, 0, 100),
});

function hsl(h: number, s: number, l: number) {
  return new Color().setHSL(h / 360, s / 100, l / 100, "srgb");
}
