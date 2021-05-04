import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any = {userID: null, userName: ''};

  constructor(private http: HttpClient, private router: Router) { }

  postRegister(userData: any): void {
    this.http.post('https://localhost:44357/api/Users/Register', userData)
      .subscribe((user:{UserID: number, UserName: string}) => {
        this.userData = user;
        console.log(this.userData);
        this.router.navigateByUrl('homepage');
      }, (() => alert('Es gibt bereits einen Benutzer mit diesem Benutzername oder Mail')));
  }

  postLogin(userData: any): void {
    this.http.post('https://localhost:44357/api/Users/Login', userData)
      .subscribe((user) => {
        this.userData = user;
        console.log(this.userData);
        this.router.navigateByUrl('homepage');
      }, (() => alert('Benutzername oder Passwort ist falsch!')));
  }

  logout(): void {
    this.userData = {UserID: null, UserName: ''};
  }

}
