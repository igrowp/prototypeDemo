import { Camera } from '@ionic-native/camera';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvAssetMessagePage } from './inv-asset-message';
import { AssetService } from './../../providers/service/asset.service';

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
