import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransPage } from './trans';

@NgModule({
  declarations: [
    TransPage,
  ],
  imports: [
    IonicPageModule.forChild(TransPage),
  ],providers:[
    BarcodeScanner
  ]
})
export class TransPageModule {}
