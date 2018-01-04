import { Camera } from '@ionic-native/camera';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Test3Page } from './test3';

@NgModule({
  declarations: [
    Test3Page,
  ],
  imports: [
    IonicPageModule.forChild(Test3Page),
  ],providers:[
    Camera
  ]
})
export class Test3PageModule {}
