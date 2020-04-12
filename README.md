# ProgressiveImageLoader

**1.3KB** light Weight, OnPushed angular component to progressively load Image.

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
| **urlData** | false| - | Array<UrlWithDimensions>| List of image urls with their dimensions|
| **blurMultiplier** | true| 15(px) | number| Difference blur between each image change in pixels|
| **animationDuration** | true| 500(ms) | number| Duration of blur animation between each image change in milliseconds|

**Note**: urlData is sorted based on ascending width.

**UrlWithDimensions**

| Property | Optional | dataType | description  |
| -------------- | ------- | ------- | ---- |
| **url** | false| string| Url of the image|
| **width** | false| number| Width of Image|


## Further help / Suggestions
Contact me at `kishinkarra@gmail.com`
