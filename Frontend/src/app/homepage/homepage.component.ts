import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../services/recipe.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  categories = new FormControl();
  categoryList: string[] = [];
  categoryIDName: { CategoryID: undefined, Name: string }[] = [];
  assignCategoryList: number[] = [];
  friends = new FormControl();
  friendList: string[] = ['eigene Rezepte'];
  friendIDList: number[] = [];
  friendIDName: {UserID: undefined, Name: string}[] = [{UserID: this.userService.userData.userID, Name: 'eigene Rezepte'}];
  filterFriendList: number[] = [];
  recipeList: { RecipeID: number, Rezeptname: string, Rating: string, UserID: string, Username: string, PictureEncoded: string, Oeffentlich: false }[] = [];

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private recipeService: RecipeService) {
    http.get("https://localhost:44357/" + 'api/Users', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for(var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.friendIDName.push({UserID: obj.userID, Name: obj.username});
      }
    }, error => console.error(error));
    http.get("https://localhost:44357/" + 'api/Categories', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.categoryList.push(obj.name);
        this.categoryIDName.push({CategoryID: obj.categoryID, Name: obj.name});
        console.log(this.categoryIDName);
      }
    }, error => console.error(error));
    http.get("https://localhost:44357/" + 'api/Friends/' + this.userService.userData.userID, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        if (jsonResult[i].userID1 === this.userService.userData.userID) {
          this.friendIDList.push(jsonResult[i].userID2);
        } else {
          this.friendIDList.push(jsonResult[i].userID1);
        }
      }
      for (var i = 0; i < this.friendIDList.length; i++) {
        http.get("https://localhost:44357/" + 'api/Users/' + this.friendIDList[i], {responseType: 'json'}).subscribe(result => {
          const jsonResult = JSON.parse(JSON.stringify(result));
          this.friendList.push(jsonResult.username);
        });

      }

    }, error => console.error(error));
  }

  ngOnInit(): void {
    /*  if (this.userService.userData.UserID===null){
       this.router.navigateByUrl('login');
     }*/

    this.http.get('https://localhost:44357/api/Recipes').subscribe(result => {
      for (let i = 0; i < JSON.parse(JSON.stringify(result)).length; i++) {
        let imgSrc: string;
        if (result[i].pictureEncoded === null || result[i].pictureEncoded === '') {
          imgSrc = "https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
        } else {
          imgSrc = result[i].pictureEncoded;
        }
        this.recipeList.push({
          RecipeID: result[i].recipeID,
          Rezeptname: result[i].name,
          Rating: undefined,
          UserID: result[i].userID,
          Username: undefined,
          PictureEncoded: imgSrc,
          Oeffentlich: result[i].visible
        });
        console.log('Anfang Schleife:' + i);
        let autor: string;
        let rezeptname: string;
        let recipeID: number;
        recipeID = result[i].recipeID;
        rezeptname = result[i].name;
      }
      this.http.get('https://localhost:44357/api/Users').subscribe(result => {
        for (let j = 0; j < JSON.parse(JSON.stringify(result)).length; j++) {
          for (let i = 0; i < this.recipeList.length; i++) {
            if (this.recipeList[i].UserID === JSON.parse(JSON.stringify(result))[j].userID) {
              this.recipeList[i].Username = JSON.parse(JSON.stringify(result))[j].username;
            }
          }
        }
        var element = 0;
        for (let i = 0; i < this.recipeList.length; i++) {


          var autor = this.recipeList[i].Username;
          var rezeptname = this.recipeList[i].Rezeptname;
          var imgSrc = this.recipeList[i].PictureEncoded;
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
            `        <tr>\n` +
            `          <td>    <button class="btn_add" id="btn_open">Rezept ansehen</button></td>\n` +
            `        </tr>\n` +
            `      </table>\n` +
            `<br style="clear: both"/> ` +
            `    <hr>\n` +
            `  </div>`;

          if ((this.friendIDList.includes(Number(this.recipeList[i].UserID)) && this.recipeList[i].Oeffentlich )|| this.recipeList[i].UserID === this.userService.userData.userID ){
            const div = document.getElementById('container');
            div.insertAdjacentHTML('beforeend', template);
               div.getElementsByTagName('button')[element+1].addEventListener('click', (e) => {
               this.btn_open(this.recipeList[i].RecipeID, this.recipeList[i].Username);
              });
            element++;
          }
        }
      });
    }, error => console.error(error));

  }

  btn_open(currentRecipe: number, author: string) {
    this.router.navigateByUrl('recipes');
    this.recipeService.currentRecipe = currentRecipe;
    this.http.get("https://localhost:44357/" + 'api/Recipes/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      const name = document.getElementById('rezeptname');
      name.innerHTML = jsonResult.name;
      document.getElementById('difficulty_label').innerHTML = jsonResult.difficulty;
      document.getElementById('duration_label').innerHTML = jsonResult.duration;
      document.getElementById('author_label').innerHTML = 'von ' + author;
      console.log('Pic' + jsonResult.pictureEncoded);
      console.log(jsonResult);
      if (jsonResult.pictureEncoded === null || jsonResult.pictureEncoded === '') {
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src = "https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
      } else {
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src = jsonResult.pictureEncoded;
      }
    });
    this.http.get("https://localhost:44357/" + 'api/Ingredients/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (let i = 0; i < jsonResult.length; i++) {
        const list = document.getElementById('Zutatenliste');
        const last = list.lastChild;
        const ingredient = document.createElement('li');
        ingredient.innerText = jsonResult[i].name;
        list.insertBefore(ingredient, last);
      }
    });
    this.http.get("https://localhost:44357/" + 'api/Steps/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var listelement = 1; listelement <= jsonResult.length; listelement++) {
        for (var i = 0; i < jsonResult.length; i++) {
          if (jsonResult[i].number == listelement) {
            const list = document.getElementById('Anweisungsliste');
            const last = list.lastChild;
            const ingredient = document.createElement('li');
            ingredient.innerText = jsonResult[i].describtion;
            list.insertBefore(ingredient, last);
          }
        }
      }
    });
    for (var i=0; i<this.recipeList.length; i++){
      if (this.recipeList[i].RecipeID === currentRecipe){
        if (this.recipeList[i].UserID !== this.userService.userData.userID){
          // TODO: edit und delete nicht sichtbar
          const header = document.getElementsByClassName('header');
          const edit = document.getElementsByTagName('button')[2];
          console.log('edit: ' + edit);
          edit.style.display= 'none';
            // const btn_delete = document.getElementById('delete');
            // btn_delete.style.display = 'none';

        }
      }
    }
    /* this.http.get("https://localhost:44357/" + 'api/AssignCategories/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result =>{
     const jsonResult = JSON.parse(JSON.stringify(result));
     for (var i=0; i<jsonResult.length; i++){
       const categoryID = jsonResult[i].categoryID;
       this.http.get("https://localhost:44357/" + 'api/Categories/' + categoryID, {responseType: 'json'}).subscribe(result => {
         const jsonResult = JSON.parse(JSON.stringify(result));
         console.log(jsonResult.name);
         console.log('Auswahl: '+ document.getElementsByTagName('mat-option')[1]);
       });
     }
   }); */
  }

  getCategory(event: {
    isUserInput: any;
    source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        for (let i = 0; i < this.categoryIDName.length; i++) {
          if (this.categoryIDName[i].Name === event.source.value) {
            this.assignCategoryList.push(this.categoryIDName[i].CategoryID);
          }
        }
      } else {
        for (let i = 0; i < this.categoryIDName.length; i++) {
          if (this.categoryIDName[i].Name === event.source.value) {
            for (let j = 0; j < this.assignCategoryList.length; j++) {
              if (this.assignCategoryList[j] === this.categoryIDName[i].CategoryID) {
                delete this.assignCategoryList[j];
              }
            }
          }
        }
      }
    }
  }

  filter (){
    while (document.getElementById('container').childElementCount>2){
      const last = document.getElementById('container').lastChild;
      document.getElementById('container').removeChild(last);
    }
    var element =0;
    for (var i=0; i< this.recipeList.length; i++){
      if (this.filterFriendList.includes(Number(this.recipeList[i].UserID))){
        if (this.recipeList[i].UserID === this.userService.userData.userID || this.recipeList[i].Oeffentlich)
        {
          var autor = this.recipeList[i].Username;
          var rezeptname = this.recipeList[i].Rezeptname;
          var imgSrc = this.recipeList[i].PictureEncoded;
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
            `        <tr>\n` +
            `          <td>    <button class="btn_add" id="btn_open">Rezept ansehen</button></td>\n` +
            `        </tr>\n` +
            `      </table>\n` +
            `<br style="clear: both"/> ` +
            `    <hr>\n` +
            `  </div>`;
          const div = document.getElementById('container');
          div.insertAdjacentHTML('beforeend', template);
          div.getElementsByTagName('button')[element+1].addEventListener('click', (e) => {
            this.btn_open(this.recipeList[i].RecipeID, this.recipeList[i].Username);
            element++;
          })
        }

      }
    }
  }

  getFriend(event: {
    isUserInput: any;
    source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        for (let i = 0; i< this.friendIDName.length; i++){
          if(this.friendIDName[i].Name === event.source.value){
            this.filterFriendList.push(this.friendIDName[i].UserID);
          }
        }
      } else {
        for (let i = 0; i< this.friendIDName.length; i++){
          if(this.friendIDName[i].Name === event.source.value){
            for (let j=0; j<this.filterFriendList.length; j++){
              if (this.filterFriendList[j] === this.friendIDName[i].UserID){
                delete this.filterFriendList[j];
              }
            }
          }
        }
      }
    }
  }
  favoriteChange(){

  }
}
