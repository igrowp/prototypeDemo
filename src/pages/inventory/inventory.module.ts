import { InventoryPage } from './inventory';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetService } from './../../providers/service/asset.service';

@NgModule({
  declarations: [
    InventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(InventoryPage),
  ],
  providers: [
    AssetService,
  ]
})
export class InventoryPageModule {}
