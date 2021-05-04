import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  myFriends: { friendsID: number, userID1: number, username: string }[]= [];
  friendsRequests: { requestID: number, userID1: number, username: string }[] = [];
  userList: any[] = [];

  findFriendsForm = new FormGroup( {
    name: new FormControl(''),
  });

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.userService.userData.userID===null){
      this.router.navigateByUrl('login');
    }else {
      this.loadRequest();
      this.loadFriends();
    }
  }

  searchUsers(): void {
    var name = this.findFriendsForm.get('name').value;
    this.http.get('https://localhost:44357/api/Users/Find/' + name)
      .subscribe((user) => {
        this.userList = Array.from(Object.keys(user), k=>user[k]);
      }, (() => alert('Es konnten keine Benutzer gefunden werden!')));
  }

  sendRequest(requestID: number): void {
    var userID1 = this.userService.userData.userID;
    if (requestID !== userID1) {
      var requestForm = new FormGroup( {
        userID1: new FormControl(userID1),
        userID2: new FormControl(requestID),
      });
      this.http.post('https://localhost:44357/api/FriendsRequests', requestForm.value)
        .subscribe((request) => {
          console.log(request);
          alert('Die Freundschaftsanfrage wurde erfolgreich gesendet.')
        }, (() => alert('Die Anfrage konnte nicht gesendet werden. ' +
          'Eventuell wurde bereits eine Anfrage gesendet oder ihr schon miteinander befreundet.')));
    }
    else {
      alert('Du kannst dir nicht selbst eine Anfrage schicken!');
    }
  }

  loadRequest(): void {
    this.friendsRequests = [];
    var userID = this.userService.userData.userID;
    this.http.get('https://localhost:44357/api/FriendsRequests/' + userID)
      .subscribe((requests) => {
        var requestList = Array.from(Object.keys(requests), k=>requests[k]);
        console.log(requestList);
        requestList.forEach((r) => {
          var userData;
          this.http.get('https://localhost:44357/api/Users/' + r.userID1)
            .subscribe((user) => {
              userData = user;
              var username = userData.username;
              if (username !== null){
                this.friendsRequests.push({
                  requestID: r.requestID,
                  userID1: r.userID1,
                  username: username
                });
              }}, ((error) => {
              console.log(error);
            }));
        });
        console.log(this.friendsRequests);
      }, ((error) => console.log(error)));
  }

  deleteRequest(request: any): void {
    console.log(request);
    this.http.delete('https://localhost:44357/api/FriendsRequests/' + request.requestID)
      .subscribe((data) => {
        console.log(data);
        this.friendsRequests = this.friendsRequests.filter(r => r !== request);
        console.log(this.friendsRequests);
      })
  }

  confirmRequest(request: any): void {
    var friendsForm = new FormGroup({
      userID1: new FormControl(request.userID1),
      userID2: new FormControl(this.userService.userData.userID)
    });
    var friendData;
    this.http.post('https://localhost:44357/api/Friends', friendsForm.value)
      .subscribe((data) => {
        friendData = data;
        this.myFriends.push({
          friendsID: friendData.friendsID,
          userID1: request.userID1,
          username: request.username
        })
        this.deleteRequest(request);
      }, (error => console.log(error)));
  }

  loadFriends(): void {
    this.myFriends = [];
    var userID = this.userService.userData.userID;
    this.http.get('https://localhost:44357/api/Friends/' + userID)
      .subscribe((friends) => {
        var friendsList = Array.from(Object.keys(friends), k=>friends[k]);
        console.log(friendsList);
        friendsList.forEach((f) => {
          var userData;
          if (f.userID1 === userID) {
            this.http.get('https://localhost:44357/api/Users/' + f.userID2)
              .subscribe((user) => {
                userData = user;
                var username = userData.username;
                if (username !== null){
                  this.myFriends.push({
                    friendsID: f.friendsID,
                    userID1: f.userID2,
                    username: username
                  });
                }}, ((error) => {
                console.log(error);
              }));
          }
          else if (f.userID2 === userID){
            this.http.get('https://localhost:44357/api/Users/' + f.userID1)
              .subscribe((user) => {
                userData = user;
                var username = userData.username;
                if (username !== null){
                  this.myFriends.push({
                    friendsID: f.friendsID,
                    userID1: f.userID1,
                    username: username
                  });
                }}, ((error) => {
                console.log(error);
              }));
          }
        });
        console.log(this.myFriends);
      }, ((error) => console.log(error)));
  }

  deleteFriend(friend: any): void {
    console.log(friend);
    this.http.delete('https://localhost:44357/api/Friends/' + friend.friendsID)
      .subscribe((data) => {
        console.log(data);
        this.myFriends = this.myFriends.filter(f => f !== friend);
        console.log(this.myFriends);
      })
  }

}
