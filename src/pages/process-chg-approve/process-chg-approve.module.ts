import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessChgApprovePage } from './process-chg-approve';

@NgModule({
  declarations: [
    ProcessChgApprovePage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessChgApprovePage),
  ],
})
export class ProcessChgApprovePageModule {}
