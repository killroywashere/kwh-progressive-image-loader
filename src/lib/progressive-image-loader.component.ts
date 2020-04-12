import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { DEFAULTS, ProgressiveImageLoaderOptions, ProgressStep } from './progressive-image-loader.service';

@Component({
  selector: 'kwh-progressive-image-loader',
  template: `
    <div [style.backgroundImage]="background" [style.backgroundColor]="background" #imageElement></div>
  `,
  styleUrls: ['./ngk-progressive-image-loader.scss']
})
export class ProgressiveImageLoaderComponent implements OnChanges, AfterViewInit, OnDestroy {

  currentSrc: string;

  @ViewChild('imageElement') imageElement: ElementRef;
  @Input() loadingOptions: ProgressiveImageLoaderOptions;
  background: string;
  private loadSubscriptions = new Subscription();
  private step: ProgressStep = ProgressStep.INITIALIZE;
  private loadingFailed = new EventEmitter<ProgressStep>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loadingOptions.firstChange) {
      this.startFromStepOne();
    }
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

  ngAfterViewInit(): void {
    this.startFromStepOne();
  }

  private sanitizeInput() {
    this.loadingOptions.blurWhileBackground = this.loadingOptions.blurWhileBackground || DEFAULTS.BLUR_THUMBNAIL;
    this.loadingOptions.blurWhileThumbnail = this.loadingOptions.blurWhileThumbnail || DEFAULTS.BLUR_THUMBNAIL;
    this.loadingOptions.animationTimeBetweenThumbnailAndOriginal =
      this.loadingOptions.animationTimeBetweenThumbnailAndOriginal || DEFAULTS.ANIMATION_DURATION;
    this.loadingOptions.animationTimeBetweenBackgroundAndThumbnail =
      this.loadingOptions.animationTimeBetweenBackgroundAndThumbnail || DEFAULTS.ANIMATION_DURATION;
  }

  ngOnDestroy(): void {
    this.loadSubscriptions.unsubscribe();
  }

  private startFromStepOne() {
    if (this.loadingOptions) {
      timer(0).subscribe(() => {
        (this.imageElement.nativeElement as HTMLElement).style.filter = `blur(${this.loadingOptions.blurWhileBackground}px)`;
        this.sanitizeInput();
        this.step = ProgressStep.INITIALIZE;
        this.applyBackgroundColor();
        this.waitForIntersection();
      });
    }

  }

  private applyBackgroundColor() {
    this.background = this.loadingOptions.backgroundColor;
    this.step = ProgressStep.BACKGROUND_APPLIED;
  }

  private waitForIntersection() {
    if (this.loadingOptions.intersectionParent) {
      const observerOptions: IntersectionObserverInit = {
        root: this.loadingOptions.intersectionParent,
        threshold: 0.25
      };

      const io = new IntersectionObserver((event) => {
        if (event[0].isIntersecting) {
          this.loadThumbnailURL();
          io.disconnect();
        }
      }, observerOptions);
      io.observe(this.imageElement.nativeElement);
    } else {
      this.loadThumbnailURL();
    }

  }


  private applyTransition(initialBlur: number, finalBlur: number, duration: number) {
    const blurKeyFrames: Array<Keyframe> = [
      {
        offset: 0,
        filter: `blur(${initialBlur}px)`
      },
      {
        offset: 1,
        filter: `blur(${finalBlur}px)`
      }
    ];
    const timingOptions: KeyframeAnimationOptions = {
      duration,
      fill: 'forwards'
    };
    (this.imageElement.nativeElement as HTMLElement).animate(blurKeyFrames, timingOptions);
  }

  private loadThumbnailURL() {
    this.loadImage(this.loadingOptions.thumbnailUrl).then(() => {
      this.step = ProgressStep.THUMBNAIL_LOADED;
      const initialBlur = this.loadingOptions.blurWhileBackground;
      const finalBlur = this.loadingOptions.blurWhileThumbnail;
      const duration = this.loadingOptions.animationTimeBetweenBackgroundAndThumbnail;
      this.applyTransition(initialBlur, finalBlur, duration);
      this.applyImageAtHalfTime(duration, this.loadingOptions.thumbnailUrl);
      this.scheduleFinalLoad(duration);
    }).catch(() => {
      this.step = ProgressStep.THUMBNAIL_LOADING_FAILED;
      this.loadingFailed.emit(this.step);
    });
  }

  private applyImageAtHalfTime(duration: number, url: string) {
    timer(duration / 2).subscribe(() => {
      this.background = `url(${url})`;
      this.cdr.markForCheck();
    });
  }

  private scheduleFinalLoad(duration) {
    timer(duration).subscribe(() => {
      this.loadFinalImage();
    });
  }

  private loadFinalImage() {
    this.loadImage(this.loadingOptions.originalUrl).then(() => {
      this.step = ProgressStep.COMPLETE;
      const initialBlur = this.loadingOptions.blurWhileThumbnail;
      const finalBlur = 0;
      const duration = this.loadingOptions.animationTimeBetweenThumbnailAndOriginal;
      this.applyTransition(initialBlur, finalBlur, duration);
      this.applyImageAtHalfTime(duration, this.loadingOptions.originalUrl);
    }).catch(() => {
      this.step = ProgressStep.FINAL_LOADING_FAILED;
      this.loadingFailed.emit(this.step);
    });
  }
}
