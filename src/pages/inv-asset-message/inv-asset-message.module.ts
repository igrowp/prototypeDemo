import { Camera } from '@ionic-native/camera';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvAssetMessagePage } from './inv-asset-message';

@NgModule({
  declarations: [
    InvAssetMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(InvAssetMessagePage),
  ],
  providers:[
    Camera
  ]
})
export class InvAssetMessagePageModule {}
