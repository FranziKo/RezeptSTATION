import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

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
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmitRegister(): void {
    this.userService.postRegister(this.registerForm.value);
  }

  onSubmitLogin(): void {
    this.userService.postLogin(this.loginForm.value);
  }

}
