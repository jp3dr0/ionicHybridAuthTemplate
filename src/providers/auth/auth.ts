import { environment } from './../../environments/environment';
import { User } from './../../models/user';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';

@Injectable()
export class AuthProvider {

  user: Observable<User>;

  loggedIn: boolean;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private http: HttpClient) {
    // fica observando se tem usuario no auth state e se tiver atribui ao atributo user
    this.user = this.afAuth.authState.switchMap(user => {
      if (user)
        return this.afs.doc<User>('users/' + user.uid).valueChanges(); // retorna usuario personalizado do db do firebase
      else
        return Observable.of(null);
    })
  }

  // metodo de "guard" para todas as pages protegidas, para testar se o usuario está logado ou nao
  canEnter() {
    // só deixa entrar se esse metodo retornar true
    return this.user
      .take(1) // prevenir de ficar fazendo subscribe por muito tempo
      .map(user => !!user) // faz map do objeto user para um boolean (ou tem ou nao tem)
      .do(loggedIn => { // operador para executar um callback. nesse caso vamos só retornar algo no console.log() caso o acesso seja negado
        //console.log(loggedIn);
        if (!loggedIn) {
          console.log("acesso negado do service");
          return false;
          // navegar para login page
        }
        else
          return true;
      })
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }

  // metodo para saber se está logado ou não, "constante"
  getAuthState() {
    return this.afAuth.authState;
  }

  // usuario atual do auth (não é o personalizado do db)
  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  public googleLoginCordova() {
    // TODO - Add items to local storage
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithRedirect(provider).then(function () {
      //return firebase.auth().getRedirectResult();
    })
      /*
      .then(function(result) {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      */
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  public googleLogin() {
    // TODO - Add items to local storage
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  // Register Page - criar um novo usuário
  public emailRegister(email, senha) {
    // TODO - Add items to local storage
    if (environment.firebaseBackend) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, senha).then(credential => {
        this.updateUserData(credential.user);
        return this.canEnter();
      })
    }
    // fazer requisições a api personalizada
    else {

    }
  }

  // Login page
  public emailLogin(email, senha) {
    // TODO - Add items to local storage
    if (environment.firebaseBackend) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, senha).then(credential => {
        this.updateUserData(credential.user);
        return this.canEnter();
      })
    }
    // fazer requisições a api personalizada
    else {

    }
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
    })
  }

  // method to retreive firebase auth after login redirect
  public redirectLogin() {
    return this.afAuth.auth.getRedirectResult();
  }

  private updateUserData(user) {
    // pega os dados do login do firebase e poe no banco de dados do firebase (firestore)
    const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/' + user.uid);

    const data: User = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
    }

    // TODO - Add user to local storage
    return userRef.set(data, { merge: true })
  }

  private settingsPage() {
    // redirecionar para pagina para atualizar os dados com base na autenticação que foi feita
    console.log(this.afAuth.auth.currentUser);
    //this.afAuth.auth.currentUser.updatePassword('cornosunidos123').then(() => console.log("OK senha"));
    this.afAuth.auth.currentUser.updateProfile({ displayName: 'corno', photoURL: 'imagem' }).then(() => console.log("OK"));
    console.log(this.afAuth.auth.currentUser);
  }

  public signOut() {
    // TODO - Remove items from local storage
    this.afAuth.auth.signOut().then(response => {
      //this.router.navigate(['/']);
      console.log("logged out");
      console.log(response);
      // navegar para login page
    });
  }

  // function to send emails using a PHP API
  sendEmail(messageData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/X-www-form-urlencoded' })
    };
    return this.http.post(environment.emailAPI, messageData, httpOptions);
  }

}
