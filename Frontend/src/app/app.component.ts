import { Component } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {RecipeService} from "./services/recipe.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';

  constructor(private userService: UserService, private router: Router, private recipeService: RecipeService) { }

  logout():void {
    this.recipeService.currentRecipe = undefined;
    this.userService.logout();
  }

  addRecipe(){
    this.recipeService.currentRecipe = undefined;
    this.recipeService.Visible=true;
    this.router.navigateByUrl('recipes');

  }

  cancel(){
    this.recipeService.currentRecipe = undefined;
    this.recipeService.Visible=true;
  }
}
