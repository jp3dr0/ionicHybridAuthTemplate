import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<any>;

  constructor(public navCtrl: NavController, private httpClient: HttpClient, private plt: Platform, private alertCtrl: AlertController, private authService: AuthProvider) {
    this.users = this.httpClient.get('https://randomuser.me/api/?results=20')
      .map(res => res['results'])
  }

  ionViewDidLoad(){
    console.log("loaded home");  
  }

  ionViewCanEnter(){
    //const canEnter = this.authService.getAuthState();
    //console.log(canEnter);
    return this.authService.authenticated;
  }

  checkPlatform() {
    let alert = this.alertCtrl.create({
      title: 'Platform',
      message: 'You are running on: ' + this.plt.platforms(),
      buttons: ['OK']
    });
    alert.present();

    if (this.plt.is('cordova')) {
      // Do Cordova stuff
    } else {
      // Do stuff inside the regular browser
    }
  }

  logout() {
    this.authService.signOut();
    this.navCtrl.setRoot(LoginPage);
  }
}
