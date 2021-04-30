import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import { Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.userData.UserID===null){
      this.router.navigateByUrl('login');
    }

  }

}
