import { User } from './../../models/user';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {

  user: Observable<User>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
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
          console.log("acesso negado");
          // navegar para login page
        }
      })
  }

  getCurrentUserObservable() {
    //return this.afAuth.user;
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  getCurrentUserToken(){
    //return this.afAuth.idTokenResult;
  }

  public googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  public emailLogin(email, senha) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, senha).then(credential => {
      this.updateUserData(credential.user);
    })
  }

  public emailSignIn(email, senha) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, senha).then(credential => {
      this.updateUserData(credential.user);
      //this.afAuth.auth.currentUser.updatePassword
    })
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
    })
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

    return userRef.set(data, { merge: true })
  }

  private settingsPage() {
    // redirecionar para pagina para atualizar os dados com base na autenticação que foi feita
    console.log(this.afAuth.auth.currentUser);
    //this.afAuth.auth.currentUser.updatePassword('cornosunidos123').then(() => console.log("OK senha"));
    this.afAuth.auth.currentUser.updateProfile({displayName:'corno', photoURL:'imagem'}).then(() => console.log("OK"));
    console.log(this.afAuth.auth.currentUser);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      //this.router.navigate(['/']);
      console.log("logged out");
      // navegar para login page
    });
  }

}
