import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CvtWebProvider } from './../providers/web/cvt.web.provider';
import { Test3Page } from './../pages/test3/test3';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { File } from '@ionic-native/file';
import { BackButtonService } from '../providers/service/backButton.service';
import { NoticeService } from './../providers/service/notice.service';
import { InvService } from './../providers/service/inv.service';
import { ConvertService } from './../providers/service/convert.service';
import { LoginService } from './../providers/service/login.service';
import { AssetService } from './../providers/service/asset.service';
import { WebService } from './../providers/service/web.service';
import { LocalStorageService } from './../providers/service/localStorage.service';
import { IonicStorageModule } from '@ionic/storage/es2015';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlertController, IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { TablesProvider } from '../providers/storage/tables';
@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    AlertController,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    LocalStorageService,
    WebService,
    AssetService,
    BarcodeScanner,
    LoginService,
    CvtWebProvider,
    PhotoLibrary,
    ConvertService,
    InvService,
    NoticeService,
    BackButtonService,
    File,
    Test3Page,
    TablesProvider,
  ]
})
export class AppModule {}

