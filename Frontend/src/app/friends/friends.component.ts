import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  myFriends: string[]= ["freind11", "freund2", "testfreund"];
  friendsRequests: Array<{name: string, id: number}> = [{name:"username1", id: 123}, {name: "user2", id: 234}];
  userList: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  searchUser(): void {
    this.userList = ["user1", "user2"];
  }
}
