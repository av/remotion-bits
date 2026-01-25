// Type definitions for culori (no official types available)
declare module "culori" {
  export interface Color {
    mode: string;
    [key: string]: number | string | undefined;
  }

  export type ColorInput = string | Color;

  export type InterpolationMode =
    | "rgb"
    | "hsl"
    | "hsv"
    | "hwb"
    | "lab"
    | "lch"
    | "oklab"
    | "oklch"
    | string;

  export type Interpolator = (t: number) => Color | undefined;

  export function interpolate(
    colors: ColorInput[],
    mode?: InterpolationMode
  ): Interpolator;

  export function formatRgb(color: Color | undefined): string | undefined;
  export function formatHex(color: Color | undefined): string | undefined;
}
