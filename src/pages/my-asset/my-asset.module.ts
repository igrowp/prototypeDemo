import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAssetPage } from './my-asset';

@NgModule({
  declarations: [
    MyAssetPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAssetPage),
  ]
})
export class MyAssetPageModule {}
