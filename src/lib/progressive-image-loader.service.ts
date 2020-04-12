import { Injectable } from '@angular/core';

@Injectable()
export class ProgressiveImageLoaderService {

  constructor() {
  }


}

export interface UrlWithDimensions {
  url: string;
  width: number;
}

export interface ProgressiveImageLoaderOptions {
  urlData: Array<UrlWithDimensions>;
  blurMultiplier?;
  animationDuration?;
}

export const DEFAULTS = {
  BLUR: 15,
  ANIMATION_DURATION: 500
};
