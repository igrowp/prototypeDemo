import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConvertListPage } from './convert-list';

@NgModule({
  declarations: [
    ConvertListPage,
  ],
  imports: [
    IonicPageModule.forChild(ConvertListPage),
  ],providers:[
    BarcodeScanner
  ]
})
export class ConvertListPageModule {}
