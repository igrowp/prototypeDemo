import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectAssetsPage } from './select-assets';

@NgModule({
  declarations: [
    SelectAssetsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectAssetsPage),
  ],
})
export class SelectAssetsPageModule {}
