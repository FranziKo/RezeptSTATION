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

  // is called by loading the friends page
  ngOnInit(): void {
    if (this.userService.userData.userID===null ||this.userService.userData.userID===undefined){
      this.router.navigateByUrl('login');
    }else {
      this.loadRequest();
      this.loadFriends();
    }
  }

  // find all users with substring in name
  searchUsers(): void {
    var name = this.findFriendsForm.get('name').value;
    this.http.get('https://gruppe4.testsites.info/api/Users/Find/' + name)
      .subscribe((user) => {
        this.userList = Array.from(Object.keys(user), k=>user[k]);
      }, (() => alert('Es konnten keine Benutzer gefunden werden!')));
  }

  // sending a friends request if none already exists
  sendRequest(requestID: number): void {
    var userID1 = this.userService.userData.userID;
    if (requestID !== userID1) {
      var requestForm = new FormGroup( {
        userID1: new FormControl(userID1),
        userID2: new FormControl(requestID),
      });
      this.http.post('https://gruppe4.testsites.info/api/FriendsRequests', requestForm.value)
        .subscribe((request) => {
          alert('Die Freundschaftsanfrage wurde erfolgreich gesendet.')
        }, (() => alert('Die Anfrage konnte nicht gesendet werden. ' +
          'Eventuell wurde bereits eine Anfrage gesendet oder ihr schon miteinander befreundet.')));
    }
    else {
      alert('Du kannst dir nicht selbst eine Anfrage schicken!');
    }
  }

  // load all the users friends requests into friendsRequests
  loadRequest(): void {
    this.friendsRequests = [];
    var userID = this.userService.userData.userID;
    this.http.get('https://gruppe4.testsites.info/api/FriendsRequests/' + userID)
      .subscribe((requests) => {
        var requestList = Array.from(Object.keys(requests), k=>requests[k]);
        requestList.forEach((r) => {
          var userData;
          this.http.get('https://gruppe4.testsites.info/api/Users/' + r.userID1)
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
      }, ((error) => console.log(error)));
  }

  // delete a friends request -> delete in database and remove from friendsRequests
  deleteRequest(request: any): void {
    this.http.delete('https://gruppe4.testsites.info/api/FriendsRequests/' + request.requestID)
      .subscribe((data) => {
        this.friendsRequests = this.friendsRequests.filter(r => r !== request);
      })
  }

  // accept a friends request -> insert a friend into database and delete the friends request
  confirmRequest(request: any): void {
    var friendsForm = new FormGroup({
      userID1: new FormControl(request.userID1),
      userID2: new FormControl(this.userService.userData.userID)
    });
    var friendData;
    this.http.post('https://gruppe4.testsites.info/api/Friends', friendsForm.value)
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

  // load all the friends of the user and add into list of myFriends
  loadFriends(): void {
    this.myFriends = [];
    var userID = this.userService.userData.userID;
    this.http.get('https://gruppe4.testsites.info/api/Friends/' + userID)
      .subscribe((friends) => {
        var friendsList = Array.from(Object.keys(friends), k=>friends[k]);
        friendsList.forEach((f) => {
          var userData;
          if (f.userID1 === userID) {
            this.http.get('https://gruppe4.testsites.info/api/Users/' + f.userID2)
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
            this.http.get('https://gruppe4.testsites.info/api/Users/' + f.userID1)
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
      }, ((error) => console.log(error)));
  }

  // delete a friendship -> delete in database and remove from myFriends
  deleteFriend(friend: any): void {
    this.http.delete('https://gruppe4.testsites.info/api/Friends/' + friend.friendsID)
      .subscribe((data) => {
        this.myFriends = this.myFriends.filter(f => f !== friend);
      })
  }

}
