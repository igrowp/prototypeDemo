import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupPage } from './popup';

@NgModule({
  declarations: [
    PopupPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupPage),
  ],
})
export class PopupPageModule {}
