import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App, Loading } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public backgroundImage = { 'background-image': 'url(assets/img/background/background-5.jpg)' };

  registerForm: FormGroup;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public navCtrl: NavController
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

  onSubmit(): void {

    let loading: Loading = this.showLoading();

    if(this.registerForm.value.email && this.registerForm.value.password){
      this.auth.emailRegister(this.registerForm.value.email, this.registerForm.value.password).then(isLogged => {
        if (isLogged) {
          //this.navCtrl.setRoot(HomePage);
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

}
