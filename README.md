# ProgressiveImageLoader

**1.6KB** (Min + gzip) light Weight, OnPushed angular component to progressively load Image.
Supports:
 - Animate Image Blur while switching URLS
 - Start loading On Custom Intersection and threshold
 - Custom Background Color Before loading

## Installation

To add the Progressive Loader to your Angular project:
```
npm install --save kwh-progressive-image-loader
```

Once installed, add the Progressive Loader to your `app.module.ts`:
```typescript
import { ProgressiveImageLoaderModule } from 'progressive-image-loader';

...

@NgModule({
   ...
   imports: [
     ...
     ProgressiveImageLoaderModule,
    ...
   ],
   ...
});
export class AppModule {}
```


## Sample usage

Now you can use the Progressive loader component in your app components, for example in `app.component.ts`:
```typescript
import { ProgressiveImageLoaderOptions } from 'progressive-image-loader';
...

@Component({...})
export class AppComponent {
    loadingOptions: ProgressiveImageLoaderOptions = {
    urlData: [
      {
        width: 480,
        url: <sample URL>
      },
      {
        width: 50,
        url: <sample URL>
      }
    ],
    blurMultiplier: 50,
    animationDuration: 1500
  };
}
}
```


And in template file `app.component.html`:
```html
<kwh-progressive-image-loader
[loadingOptions]="loadingOptions"
></kwh-progressive-image-loader>
``` 

## Input Options
Below is the list of properties for loadingOptions

**ProgressiveImageLoaderOptions**

| Property | Optional | Default Value | dataType | description  |
| -------------- | -----  |------- | ------- | ---- |
| **thumbnailURL** | false| - | string| thumbnail URL for the image to be loaded|
| **originalURL** | false| - | string| Original URL for the image to be loaded|
| **backgroundColor** | false| - | string| Background color before loading the thumbnail URL|
| **animationTimeBetweenBackgroundAndThumbnail** | true| 300 (ms) | string| Time for which the blur should animate while applying thumbnail URL|
| **animationTimeBetweenThumbnailAndOriginal** | true| 300 (ms) | string| Time for which the blur should animate while applying final (original) URL|
| **blurWhileBackground** | true| 25 (px) | string| Blur value in pixels while background color is applied|
| **blurWhileThumbnail** | true| 25 (px) | string| Blur value in pixels while thumbnail Image is applied|
| **intersectionParent** | true| - | string| If intersection parent is provided, image will start loading once the image reaches the intersection threshold|
| **intersectionThreshold** | true| 0.25 | string| fraction of image visible in the intersectionParent to trigger loading (between 0-1)|

## Output Events


|Event| Description| OutputData
|---|--------|---|
| **loadingFailed** | When Image Loading Fails | ProgressStep



In case of failed loading, possible values of ProgressStep

|Value| Description|
|--------|---|
|FINAL_LOADING_FAILED | When Original Image failed to load|
|THUMBNAIL_LOADING_FAILED| When Thumbnail Image Failed to load|

## Further help / Suggestions
Contact me at `kishinkarra@gmail.com`
