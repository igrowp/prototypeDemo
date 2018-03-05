import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessDetailPage } from './process-detail';

@NgModule({
  declarations: [
    ProcessDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessDetailPage),
  ],
})
export class ProcessDetailPageModule {}
