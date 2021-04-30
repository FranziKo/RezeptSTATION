import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  myFriends: string[]= ["freind11", "freund2", "testfreund"];
  friendsRequests: Array<{name: string, id: number}> = [{name:"username1", id: 123}, {name: "user2", id: 234}];
  userList: string[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.userData.UserID===null){
      this.router.navigateByUrl('login');
    }
  }

  searchUser(): void {
    this.userList = ["user1", "user2"];
  }
}
