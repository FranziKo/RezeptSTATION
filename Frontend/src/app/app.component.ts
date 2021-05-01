import { Component } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';

  constructor(private userService: UserService, private router: Router) { }

  logout():void {
    this.userService.logout();
  }

  addRecipe(){
    this.router.navigateByUrl('recipes');
    let element: HTMLElement = document.getElementById('edit') as HTMLElement;
    element.click();

  }
}
