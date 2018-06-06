import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeAssetStatePage } from './change-asset-state';

@NgModule({
  declarations: [
    ChangeAssetStatePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeAssetStatePage),
  ],
})
export class ChangeAssetStatePageModule {}
