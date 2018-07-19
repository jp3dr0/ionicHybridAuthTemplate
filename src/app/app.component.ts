import { PlatformProvider } from './../providers/platform/platform';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  public loggedIn: boolean;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public platformProvider: PlatformProvider, private auth: AuthProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

    //this.loggedIn = true;
    //this.rootPage = HomePage;

    this.auth.getAuthState().subscribe(loggedIn => {
      this.loggedIn = !!loggedIn;
      this.rootPage = this.loggedIn ? HomePage : LoginPage;
      /*
      if (this.loggedIn) {
        this.nav.setRoot(HomePage);
      }
      else
        this.nav.setRoot(LoginPage);
      */
      console.log(!!loggedIn);
      console.log(this.rootPage);
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platformProvider.checkIfCordova()) {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);

        // set status bar to white
        this.statusBar.backgroundColorByHexString('#ffffff');
        //this.statusBar.styleDefault();
        this.splashScreen.hide();
        console.log("fazendo coisas do cordova no app component");
      }
      else {
        console.log("nao vou fazer coisas do cordova no app component");
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
