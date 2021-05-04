import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import { Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private recipeService: RecipeService) {

  }

  ngOnInit(): void {
   /*  if (this.userService.userData.UserID===null){
      this.router.navigateByUrl('login');
    }*/

    this.http.get('https://localhost:44357/api/Recipes').subscribe(result => {
      for (let i=0; i< JSON.parse(JSON.stringify(result)).length; i++){
        let autor: string;
        let rezeptname: string;
        let imgSrc: string;
        let recipeID: number;
        if (result[i].pictureEncoded === null || result[i].pictureEncoded === ''){
          imgSrc = "https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
        } else {
          console.log(result[i].pictureEncoded)
          imgSrc = result[i].pictureEncoded;
        }
        rezeptname= result[i].name;
        recipeID = result[i].recipeID;
        let template = `  <div class ="rezept">\n` +
          `    <img style="float: left; margin-right: 50px"src=${imgSrc} width="100">\n` +
          `      <table>\n` +
          `        <tr>\n` +
          `          <td>    <label>\n` +
          `        <b>${rezeptname}</b>\n` +
          `          </label></td>\n` +
          `        </tr>\n` +
          `        <tr>\n` +
          `          <td>    <label>*****</label></td>\n` +
          `        </tr>\n` +
          `        <tr>\n` +
          `          <td>    <label>${autor}</label></td>\n` +
          `        </tr>\n` +
          `      </table>\n` +
          ` <button (click)="btn_open()", class="btn_add" id="btn_open">Rezept ansehen</button>`+
          `<br style="clear: both"/> ` +
          `    <hr>\n` +
          `  </div>`;
        const div = document.getElementById('container');
        div.insertAdjacentHTML( 'beforeend', template );
        div.getElementsByTagName('button')[i].addEventListener('click', (e) => {
          this.btn_open(recipeID);
        });
      }
    }, error => console.error(error));

  }

  btn_open(currentRecipe: number){
    this.router.navigateByUrl('recipes');
    this.recipeService.currentRecipe=currentRecipe;
    this.http.get("https://localhost:44357/" + 'api/Recipes/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      const name = document.getElementById('rezeptname');
      name.innerHTML = jsonResult.name;
      document.getElementById('difficulty_label').innerHTML = jsonResult.difficulty;
      document.getElementById('duration_label').innerHTML = jsonResult.duration;
      console.log('Pic' + jsonResult.pictureEncoded);
      console.log(jsonResult);
      if (jsonResult.pictureEncoded === null || jsonResult.pictureEncoded === ''){
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src ="https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
      } else {
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src = jsonResult.pictureEncoded;
      }
    });
  }
}
