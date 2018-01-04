import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrantingPage } from './granting';

@NgModule({
  declarations: [
    GrantingPage,
  ],
  imports: [
    IonicPageModule.forChild(GrantingPage),
  ],
})
export class GrantingPageModule {}
