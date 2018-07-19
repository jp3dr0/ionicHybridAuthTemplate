import { PlatformProvider } from './../../providers/platform/platform';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, App, Loading, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';

import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //@ViewChild(Nav) nav: Nav;

  public loginForm: any;

  public backgroundImage = { 'background-image': 'url(assets/img/background/background-5.jpg)' };

  signinForm: FormGroup;

  constructor(

    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public auth: AuthProvider,
    public platform: PlatformProvider
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    if (this.platform.checkIfCordova()) {
      this.auth.redirectLogin().then(result => {
        console.log(result);
      });
    }
  }

  login() {
    const loading = this.loadingCtrl.create({
      duration: 500
    });

    loading.onDidDismiss(() => {
      const alert = this.alertCtrl.create({
        title: 'Logged in!',
        subTitle: 'Thanks for logging in.',
        buttons: ['Dismiss']
      });
      alert.present();

      alert.onDidDismiss(() => {
        //this.auth.toogleEnter();
      })
    });

    loading.present();

  }

  goToSignup() {
    // this.navCtrl.push(SignupPage);
  }

  goToResetPassword() {
    // this.navCtrl.push(ResetPasswordPage);
  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    /*
    setTimeout(() => {
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    }, 2000)
    */
    if (this.signinForm.value.email && this.signinForm.value.password) {
      this.auth.emailLogin(this.signinForm.value.email, this.signinForm.value.password).then(isLogged => {
        console.log("logou do login page" + !!isLogged);
        if (!!isLogged) {
          //this.navCtrl.setRoot(HomePage);
          setTimeout(() => this.navCtrl.setRoot(HomePage), 1000);
          loading.dismiss();
        }
      }).catch((error: any) => {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
      });
    }

  }

  onSignup(): void {
    this.navCtrl.push(RegisterPage);
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  public rootHome() {
    this.navCtrl.setRoot(HomePage);
  }

  public googleLogin() {
    let isCordova = this.platform.checkIfCordova();
    if (isCordova) {
      this.auth.googleLoginCordova().then(result => {
        console.log(result);
        this.auth.redirectLogin();
      })
      console.log("cordova login");
    }
    else {
      this.auth.googleLogin().then(logged => {
        console.log(logged);

      });
    }
  }

}
