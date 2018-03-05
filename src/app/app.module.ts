import { AssetWebProvider } from './../providers/web/asset.web.provider';
import { TabsPage } from './../pages/tabs/tabs';
import { LoginDBProvider } from './../providers/storage/login.db.provider';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CvtWebProvider } from './../providers/web/cvt.web.provider';
import { Test3Page } from './../pages/test3/test3';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { File } from '@ionic-native/file';
import { BackButtonService } from '../providers/service/backButton.service';
import { NoticeService } from './../providers/service/notice.service';
import { InvService } from './../providers/service/inv.service';
import { CvtService } from './../providers/service/cvt.service';
import { LoginService } from './../providers/service/login.service';
import { AssetService } from './../providers/service/asset.service';
import { IonicStorageModule } from '@ionic/storage/es2015';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlertController, IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { DBService } from '../providers/storage/db.service';
import { PubDBProvider } from '../providers/storage/pub.db.provider';
import { InvDBProvider } from '../providers/storage/inv.db.provider';
import { CvtDBProvider } from '../providers/storage/cvt.db.provider';
import { LoginWebProvider } from '../providers/web/login.web.provider';
import { InvWebProvider } from '../providers/web/inv.web.provider';
import { AttachmentWebProvider } from '../providers/web/attachment.web.provider';
import { AssetHandleService } from '../providers/service/asset.handle.service';
import { AssetHandleDBProvider } from '../providers/storage/asset.handle.db.provider';
import { AssetHandleWebProvider } from '../providers/web/asset.handle.web.provider';
import { WorkflowWebProvider } from '../providers/web/workflow.web.provider';
@NgModule({
  declarations: [
    MyApp,
    TabsPage
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
    AssetService,
    BarcodeScanner,
    LoginService,
    
    PhotoLibrary,
    AssetHandleService,
    CvtService,
    InvService,
    NoticeService,
    BackButtonService,
    File,
    Test3Page,
    DBService,
    LoginDBProvider,
    AssetHandleDBProvider,
    PubDBProvider,
    InvDBProvider,
    CvtDBProvider,
    LoginWebProvider,
    InvWebProvider,
    AssetWebProvider,
    CvtWebProvider,
    AttachmentWebProvider,
    AssetHandleWebProvider,
    WorkflowWebProvider,
  ]
})
export class AppModule {}

