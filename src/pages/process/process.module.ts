import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessPage } from './process';

@NgModule({
  declarations: [
    ProcessPage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessPage),
  ],
})
export class ProcessPageModule {}
