import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessApprovePage } from './process-approve';

@NgModule({
  declarations: [
    ProcessApprovePage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessApprovePage),
  ],
})
export class ProcessApprovePageModule {}
