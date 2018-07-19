import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, AlertController } from '../../../node_modules/ionic-angular';

/*
  Generated class for the PlatformProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlatformProvider {
  private platforms: string[];
  constructor(private http: HttpClient, private plt: Platform, private alertCtrl: AlertController) {
    console.log('Hello PlatformProvider Provider');
    this.platforms = this.plt.platforms();
  }

  public getCurrentPlatforms() {
    this.platforms = this.plt.platforms();
    return this.platforms;
  }

  public alertCurrentPlatform() {
    let alert = this.alertCtrl.create({
      title: 'Platform',
      message: 'You are running on: ' + this.platforms,
      buttons: ['OK']
    });
    alert.present();
  }

  public checkIfCordova(){
    this.getCurrentPlatforms();
    if (this.plt.is('cordova')) {
      // Do Cordova stuff
      return true;
    } else {
      // Do stuff inside the regular browser
      return false;
    }
  }
}
