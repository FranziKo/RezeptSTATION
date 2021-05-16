import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account = true;
  loginForm = new FormGroup( {
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  registerForm = new FormGroup( {
    userName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmitRegister(): void {
    // check if password and confirm password is the same
    if ( this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      const register = {
        userName: this.registerForm.value.user,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      }
      this.userService.postRegister(register);
    }
    else {
      alert("Die Passwörter stimmen nicht überein.");
    }
  }

  onSubmitLogin(): void {
    this.userService.postLogin(this.loginForm.value);
  }

}

