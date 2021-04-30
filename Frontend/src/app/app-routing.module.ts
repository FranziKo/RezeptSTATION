import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {FriendsComponent} from "./friends/friends.component";
import {RecipesComponent} from "./recipes/recipes.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: 'homepage', component: HomepageComponent},
  {path: 'friends', component: FriendsComponent},
  {path: 'recipes', component: RecipesComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

