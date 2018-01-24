import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MinePage } from './mine';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileTransfer} from '@ionic-native/file-transfer';


@NgModule({
  declarations: [
    MinePage,
  ],
  imports: [
    IonicPageModule.forChild(MinePage),
  ],
  providers: [
    BarcodeScanner,
    Camera,
    ImagePicker,
    FileTransfer
  ]
})
export class MinePageModule {}