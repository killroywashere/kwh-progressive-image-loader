import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { ProgressiveImageLoaderOptions } from './progressive-image-loader.service';

@Component({
  selector: 'kwh-progressive-image-loader',
  template: `
    <img alt="Progressively loading Image" [src]="currentSrc">
  `,
  styleUrls: ['./ngk-progressive-image-loader.scss']
})
export class ProgressiveImageLoaderComponent implements OnChanges {

  currentSrc: string;

  @Input() loadingOptions: ProgressiveImageLoaderOptions;
  private currentIndex: number;
  private loadSubscriptions = new Subscription();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(): void {
    this.sortCurrentOptions();
    this.currentIndex = 0;
    this.startLoadingCurrentURL();
  }


  private sortCurrentOptions() {
    this.loadingOptions.urlData = this.loadingOptions.urlData.sort((dataFirst, dataSecond) => {
      return dataFirst.width > dataSecond.width ? 1 : -1;
    });
  }

  private startLoadingCurrentURL() {
    const imageURL = this.loadingOptions.urlData[this.currentIndex].url;
    this.loadImage(imageURL).then(() => {
      this.setCurrentURLAndIncrement();
    }).catch();
  }


  protected loadImage(imageURL: string) {
    return new Promise((resolve, reject) => {
      let imageTag = new Image();
      this.loadSubscriptions.add(fromEvent(imageTag, 'load').subscribe(() => {
        imageTag = null;
        this.renewLoadSubscriptions();
        resolve(imageURL);
      }));
      imageTag.src = imageURL;
    });
  }

  private renewLoadSubscriptions() {
    this.loadSubscriptions.unsubscribe();
    this.loadSubscriptions = null;
    this.loadSubscriptions = new Subscription();
  }

  private setCurrentURLAndIncrement() {
    this.currentSrc = this.loadingOptions.urlData[this.currentIndex].url;
    this.cdr.markForCheck();
    timer(0).subscribe(() => {
      this.currentIndex++;
      if (this.loadingOptions.urlData[this.currentIndex]) {
        this.startLoadingCurrentURL();
      }
    });

  }

}
