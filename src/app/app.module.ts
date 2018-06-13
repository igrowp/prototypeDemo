import { Camera } from '@ionic-native/camera';
import { AssetWebProvider } from './../providers/web/asset.web.provider';
import { TabsPage } from './../pages/tabs/tabs';
import { LoginDBProvider } from './../providers/storage/login.db.provider';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CvtWebProvider } from './../providers/web/cvt.web.provider';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Transfer } from '@ionic-native/transfer';
import { AppVersion } from '@ionic-native/app-version';
import { ImagePicker } from '@ionic-native/image-picker';

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
import { PubWebProvider } from '../providers/web/pub.web.provider';
import { FileService } from '../providers/service/file.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AttachmentService } from '../providers/service/attachment.service';
import { ChangeWebProvider } from '../providers/web/change.web.provider';
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
    Camera,
    AlertController,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    AssetService,
    BarcodeScanner,
    LoginService,
    ScreenOrientation,
    
    
    PhotoLibrary,
    AssetHandleService,
    CvtService,
    InvService,
    NoticeService,
    BackButtonService,
    FileService,
    AttachmentService,

    AppVersion, 
    File,
    FileOpener,
    Transfer,
    ImagePicker,

    DBService,
    LoginDBProvider,
    AssetHandleDBProvider,
    PubDBProvider,
    InvDBProvider,
    CvtDBProvider,
    PubWebProvider,
    ChangeWebProvider,

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

