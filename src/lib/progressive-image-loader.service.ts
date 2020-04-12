import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressiveImageLoaderService {

  constructor() { }
}

export interface UrlWithDimensions {
  url: string;
  width: number;
}

export interface ProgressiveImageLoaderOptions {
  urlData: Array<UrlWithDimensions>;
}
