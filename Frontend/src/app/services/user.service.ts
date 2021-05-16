import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import sha256 from 'crypto-js/sha256';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any = {userID: null, userName: ''};

  constructor(private http: HttpClient, private router: Router) { }

  postRegister(userData: any): void {
    userData.password = sha256(userData.password).toString();
    this.http.post('https://gruppe4.testsites.info/api/Users/Register', userData)
      .subscribe((user: {UserID: number, UserName: string}) => {
        this.userData = user;
        this.router.navigateByUrl('homepage');
      }, (() => alert('Es gibt bereits einen Benutzer mit diesem Benutzername oder Mail')));
  }

  postLogin(userData: any): void {
    userData.password = sha256(userData.password).toString();
    this.http.post('https://gruppe4.testsites.info/api/Users/Login', userData)
      .subscribe((user) => {
        this.userData = user;
        this.router.navigateByUrl('homepage');
      }, (() => alert('Benutzername oder Passwort ist falsch!')));
  }

  logout(): void {
    this.userData = {UserID: null, UserName: ''};
  }

}
