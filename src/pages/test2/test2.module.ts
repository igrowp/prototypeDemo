import { Camera } from '@ionic-native/camera';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Test2Page } from './test2';

@NgModule({
  declarations: [
    Test2Page,
  ],
  imports: [
    IonicPageModule.forChild(Test2Page),
  ],
  providers:[
    Camera
  ]
})
export class Test2PageModule {}
