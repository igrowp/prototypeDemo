import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';  
import { IonJPushModule } from 'ionic2-jpush'

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonJPushModule,
    IonicPageModule.forChild(LoginPage),
  ]
})
export class LoginPageModule {}
