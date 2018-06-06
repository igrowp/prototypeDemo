import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeManagerPage } from './change-manager';

@NgModule({
  declarations: [
    ChangeManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeManagerPage),
  ],
})
export class ChangeManagerPageModule {}
