import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { DEFAULTS, ProgressiveImageLoaderOptions } from './progressive-image-loader.service';

@Component({
  selector: 'kwh-progressive-image-loader',
  template: `
    <img alt="Progressively loading Image" [src]="currentSrc" #imageElement>
  `,
  styleUrls: ['./ngk-progressive-image-loader.scss']
})
export class ProgressiveImageLoaderComponent implements OnChanges, AfterViewInit {

  currentSrc: string;

  @ViewChild('imageElement') imageElement: ElementRef;
  @Input() loadingOptions: ProgressiveImageLoaderOptions;
  private currentIndex: number;
  private loadSubscriptions = new Subscription();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes) {
      this.sanitizeInput();
      this.sortCurrentOptions();
      this.currentIndex = 0;
      this.startLoadingCurrentURL();
    }
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
    if (this.currentIndex !== 0) {
      const keyframe = [
        {
          offset: 0,
          filter: `blur(${(this.loadingOptions.urlData.length - this.currentIndex) * this.loadingOptions.blurMultiplier}px)`
        },
        {
          offset: 1,
          filter: `blur(${(this.loadingOptions.urlData.length - this.currentIndex - 1) * this.loadingOptions.blurMultiplier}px)`
        }
      ];
      (this.imageElement.nativeElement as HTMLElement).animate(keyframe, {
        duration: this.loadingOptions.animationDuration,
        fill: 'forwards'
      });
      timer(this.loadingOptions.animationDuration / 2).subscribe(() => {
        this.setCurrentSrc();
        this.currentIndex++;
        if (this.loadingOptions.urlData[this.currentIndex]) {
          this.startLoadingCurrentURL();
        }
      });
    } else {
      this.setCurrentSrc();
      this.currentIndex++;
      this.startLoadingCurrentURL();
    }

  }

  setCurrentSrc() {
    this.currentSrc = this.loadingOptions.urlData[this.currentIndex].url;
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    const maxBlur = this.loadingOptions.urlData.length * this.loadingOptions.animationDuration;
    this.imageElement.nativeElement.style.filter = `blur(${maxBlur}px)`;
  }

  private sanitizeInput() {
    this.loadingOptions.animationDuration = this.loadingOptions.animationDuration || DEFAULTS.ANIMATION_DURATION;
    this.loadingOptions.blurMultiplier = this.loadingOptions.blurMultiplier || DEFAULTS.BLUR;
  }
}
