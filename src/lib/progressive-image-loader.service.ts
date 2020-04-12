import { Injectable } from '@angular/core';

@Injectable()
export class ProgressiveImageLoaderService {

  constructor() {
  }


}

export interface ProgressiveImageLoaderOptions {
  thumbnailUrl: string;
  originalUrl: string;
  backgroundColor: string;
  animationTimeBetweenBackgroundAndThumbnail?: number;
  animationTimeBetweenThumbnailAndOriginal?: number;
  intersectionParent?: HTMLElement;
  blurWhileThumbnail?: number;
  blurWhileBackground?: number;
  intersectionThreshold?: number;
}

export const DEFAULTS = {
  BLUR_BACKGROUND: 25,
  BLUR_THUMBNAIL: 15,
  ANIMATION_DURATION: 300,
  INTERSECTION_THRESHOLD: 0.25
};

export enum ProgressStep {
  INITIALIZE,
  BACKGROUND_APPLIED,
  THUMBNAIL_LOADED,
  THUMBNAIL_LOADING_FAILED,
  FINAL_LOADING_FAILED,
  COMPLETE
}
