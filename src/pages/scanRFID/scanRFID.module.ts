import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanRFIDPage } from './scanRFID';

@NgModule({
  declarations: [
    ScanRFIDPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanRFIDPage),
  ],providers:[
  ]
})
export class ScanRFIDPageModule {}
