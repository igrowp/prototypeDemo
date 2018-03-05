import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdlePage } from './idle';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    IdlePage,
  ],
  imports: [
    IonicPageModule.forChild(IdlePage),
  ],
  providers:[
    Camera
  ]
})
export class IdlePageModule {}
