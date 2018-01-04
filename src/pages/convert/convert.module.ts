import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvertPage } from './convert';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AssetService } from './../../providers/service/asset.service';


@NgModule({
  declarations: [
    ConvertPage,
  ],
  imports: [
    IonicPageModule.forChild(ConvertPage),

  ],
  providers: [
    AssetService,
    BarcodeScanner
  ]
})
export class ConvertPageModule { }
