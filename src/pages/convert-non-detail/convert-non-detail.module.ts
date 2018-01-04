import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvertNonDetailPage } from './convert-non-detail';

@NgModule({
  declarations: [
    ConvertNonDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ConvertNonDetailPage),
  ],
})
export class ConvertNonDetailPageModule {}
