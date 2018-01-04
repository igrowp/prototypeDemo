import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAssetMessagePage } from './my-asset-message';

@NgModule({
  declarations: [
    MyAssetMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(MyAssetMessagePage),
  ]
})
export class MyAssetMessagePageModule {}
