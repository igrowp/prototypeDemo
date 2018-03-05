import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAssetMessagePage } from './my-asset-message';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyAssetMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(MyAssetMessagePage),
  ],providers:[
    Camera
  ]
})
export class MyAssetMessagePageModule {}
