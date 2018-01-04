import { GrantingPage } from './../granting/granting';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignaturePage } from './signature';

@NgModule({
  declarations: [
    SignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(SignaturePage),
  ],
  providers:[
    PhotoLibrary,
    GrantingPage
  ]
})
export class SignaturePageModule {}
