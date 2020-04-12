import { NgModule } from '@angular/core';
import { ProgressiveImageLoaderComponent } from './progressive-image-loader.component';
import { ProgressiveImageLoaderService } from './progressive-image-loader.service';



@NgModule({
  declarations: [ProgressiveImageLoaderComponent],
  imports: [
  ],
  exports: [ProgressiveImageLoaderComponent],
  providers: [
    ProgressiveImageLoaderService
  ]
})
export class ProgressiveImageLoaderModule { }
