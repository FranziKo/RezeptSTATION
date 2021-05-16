import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RecipeService} from "../services/recipe.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  empty = true;
  categories = new FormControl();
  categoryList: string[] = [];
  filteredRecipes: number[] = [];
  categoryIDName: { CategoryID: undefined, Name: string }[] = [];
  assignCategoryList: number[] = [];
  friends = new FormControl();
  friendList: string[] = ['eigene Rezepte'];
  friendIDList: number[] = [];
  friendIDName: { UserID: undefined, Name: string }[] = [{
    UserID: this.userService.userData.userID,
    Name: 'eigene Rezepte'
  }];
  ratingList: {RecipeID: number, Score: number}[] = [];
  filterFriendList: number[] = [];
  favoriteList: number[] = [];
  recipeList: { RecipeID: number, Rezeptname: string, Rating: string, UserID: string, Username: string, PictureEncoded: string, Oeffentlich: false, Score: number }[] = [];

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private recipeService: RecipeService) {
    this.empty = true;
    http.get("https://gruppe4.testsites.info/" + 'api/Users', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.friendIDName.push({UserID: obj.userID, Name: obj.username});
      }
    }, error => console.error(error));
    http.get("https://gruppe4.testsites.info/" + 'api/Categories', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.categoryList.push(obj.name);
        this.categoryIDName.push({CategoryID: obj.categoryID, Name: obj.name});
      }
    }, error => console.error(error));
    http.get("https://gruppe4.testsites.info/" + 'api/Friends/' + this.userService.userData.userID, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        if (jsonResult[i].userID1 === this.userService.userData.userID) {
          this.friendIDList.push(jsonResult[i].userID2);
        } else {
          this.friendIDList.push(jsonResult[i].userID1);
        }
      }
      for (var i = 0; i < this.friendIDList.length; i++) {
        http.get("https://gruppe4.testsites.info/" + 'api/Users/' + this.friendIDList[i], {responseType: 'json'}).subscribe(result => {
          const jsonResult = JSON.parse(JSON.stringify(result));
          this.friendList.push(jsonResult.username);
        });

      }

    }, error => console.error(error));
  }

  ngOnInit(): void {
    if (this.userService.userData.userID===null||this.userService.userData.userID===undefined){
       this.router.navigateByUrl('login');
     }
    this.http.get('https://gruppe4.testsites.info/api/Ratings').subscribe(result => {
      for (var i=0; i< JSON.parse(JSON.stringify(result)).length; i++){
        const recipeID = JSON.parse(JSON.stringify(result))[i].recipeID;
        const score = JSON.parse(JSON.stringify(result))[i].score;
        this.ratingList.push({RecipeID: recipeID, Score: score});
      }
    });
    this.http.get('https://gruppe4.testsites.info/api/Favorites').subscribe(result => {
      for (var i=0; i< JSON.parse(JSON.stringify(result)).length; i++){
        this.favoriteList.push(JSON.parse(JSON.stringify(result))[i].recipeID);
      }
    });
    this.http.get('https://gruppe4.testsites.info/api/Recipes').subscribe(result => {
      for (let i = 0; i < JSON.parse(JSON.stringify(result)).length; i++) {
        let sum =0;
        let count =0;
        for (let j=0; j < this.ratingList.length; j++){
          if (this.ratingList[j].RecipeID === result[i].recipeID){
            count ++;
            sum += this.ratingList[j].Score;
          }
        }
        const avg = sum / count;
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
          Oeffentlich: result[i].visible,
          Score: avg
        });
        let autor: string;
        let rezeptname: string;
        let recipeID: number;
        recipeID = result[i].recipeID;
        rezeptname = result[i].name;
      }
      this.http.get('https://gruppe4.testsites.info/api/Users').subscribe(result => {
        for (let j = 0; j < JSON.parse(JSON.stringify(result)).length; j++) {
          for (let i = 0; i < this.recipeList.length; i++) {
            if (this.recipeList[i].UserID === JSON.parse(JSON.stringify(result))[j].userID) {
              this.recipeList[i].Username = JSON.parse(JSON.stringify(result))[j].username;
            }
          }
        }
        var element = 0;
        for (let i = 0; i < this.recipeList.length; i++) {


          let template = this.fillTemplateRecipe(this.recipeList[i]);

          if ((this.friendIDList.includes(Number(this.recipeList[i].UserID)) && this.recipeList[i].Oeffentlich) || this.recipeList[i].UserID === this.userService.userData.userID) {
            const div = document.getElementById('searchresult');
            this.empty = false;
            div.insertAdjacentHTML('beforeend', template);
            div.getElementsByTagName('button')[element].addEventListener('click', (e) => {
              this.btn_open(this.recipeList[i].RecipeID, this.recipeList[i].Username);
            });
            const index = element;
            div.getElementsByTagName('input')[element].addEventListener('click', (e) => {
              this.favorite(this.recipeList[i].RecipeID, this.recipeList[i].UserID, index);
            });
            if (this.favoriteList.includes(this.recipeList[i].RecipeID)){
              (div.getElementsByTagName('input')[element] as HTMLInputElement).checked = true;
            }
            element++;
          }
        }
      });
    }, error => console.error(error));

  }

  btn_open(currentRecipe: number, author: string) {
    this.router.navigateByUrl('recipes');
    this.recipeService.currentRecipe = currentRecipe;
    for (let i=0; i<this.recipeList.length; i++){
      if (currentRecipe === Number(this.recipeList[i].RecipeID)){
        if (this.userService.userData.userID !== this.recipeList[i].UserID){
          this.recipeService.Visible = false;
        }
      }

    }
    this.http.get("https://gruppe4.testsites.info/" + 'api/Recipes/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      const name = document.getElementById('rezeptname');
      name.innerHTML = jsonResult.name;
      document.getElementById('difficulty_label').innerHTML = jsonResult.difficulty;
      document.getElementById('duration_label').innerHTML = jsonResult.duration;
      document.getElementById('author_label').innerHTML = 'von ' + author;
      if (jsonResult.pictureEncoded === null || jsonResult.pictureEncoded === '') {
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src = "https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
      } else {
        const img = (document.getElementById('picture_meal')) as HTMLImageElement;
        img.src = jsonResult.pictureEncoded;
      }
    });
    this.http.get("https://gruppe4.testsites.info/" + 'api/Ingredients/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (let i = 0; i < jsonResult.length; i++) {
        const list = document.getElementById('Zutatenliste');
        const last = list.lastChild;
        const ingredient = document.createElement('li');
        ingredient.innerText = jsonResult[i].name;
        list.insertBefore(ingredient, last);
      }
    });
    this.http.get("https://gruppe4.testsites.info/" + 'api/Steps/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
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
                this.assignCategoryList.splice(j, 1);
              }
            }
          }
        }
      }
    }
  }

  filter() {
    this.empty = true;
    const recipes = document.getElementsByClassName('rezept');
    while(recipes[0]){
      document.getElementById('searchresult').removeChild(recipes[0]);
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.post('https://gruppe4.testsites.info/api/AssignCategories/getRecipesByCategories', this.assignCategoryList, {headers:headers}).subscribe(result => {
      var element = 0;
      for (var i = 0; i < this.recipeList.length; i++) {
        var show = false;
        this.filteredRecipes = result.toString().split(',').map(x=>+x);
        if (this.filteredRecipes.includes(this.recipeList[i].RecipeID) || this.assignCategoryList.length === 0){
        if (this.filterFriendList.includes(Number(this.recipeList[i].UserID)) || this.filterFriendList.length === 0 ) {
          if (this.recipeList[i].UserID === this.userService.userData.userID || this.recipeList[i].Oeffentlich) {
            if ((document.getElementById('filterFavorite-input') as HTMLInputElement).checked){
              if (this.favoriteList.includes(this.recipeList[i].RecipeID)) {
                show = true;
              }
            } else {
              show = true;
            }
            if (show){
              let template = this.fillTemplateRecipe(this.recipeList[i]);
              const div = document.getElementById('searchresult');
              div.insertAdjacentHTML('beforeend', template);
              let recipeID = this.recipeList[i].RecipeID;
              let username = this.recipeList[i].Username;
              let userId = this.recipeList[i].UserID;
              this.empty = false;
              div.getElementsByTagName('button')[element].addEventListener('click', (e) => {
                this.btn_open(recipeID, username);
              });
              if (this.favoriteList.includes(this.recipeList[i].RecipeID)){
                (div.getElementsByTagName('input')[element] as HTMLInputElement).checked = true;
              }
              const index = element;
              div.getElementsByTagName('input')[element].addEventListener('click', (e) => {
                this.favorite(recipeID, userId, index);
              });
              element++;
            } else {
              this.empty= true;
            }
          }
        }
        }
      }
    });
  }

  getFriend(event: {
    isUserInput: any;
    source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        for (let i = 0; i < this.friendIDName.length; i++) {
          if (this.friendIDName[i].Name === event.source.value) {
            this.filterFriendList.push(this.friendIDName[i].UserID);
          }
        }
      } else {
        for (let i = 0; i < this.friendIDName.length; i++) {
          if (this.friendIDName[i].Name === event.source.value) {
            for (let j = 0; j < this.filterFriendList.length; j++) {
              if (this.filterFriendList[j] === this.friendIDName[i].UserID) {
                this.filterFriendList.splice(j, 1);
              }
            }
          }
        }
      }
    }
  }
  favorite(currentRecipe: number, user: string, index: number){
    //alert("index:"+index);
    var body= {RecipeID: 0, UserID: ''};
    body.UserID = user;
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    if ((document.getElementsByClassName('favorite')[index] as HTMLInputElement).checked) {
      this.favoriteList.push(currentRecipe);
      body.RecipeID = currentRecipe;
      this.http.post('https://gruppe4.testsites.info/api/Favorites', body, {headers: headers}).subscribe( result => {alert('Rezept wurde als Favorit gespeichert!')});
    } else {
    var indexFavorite = this.favoriteList.indexOf(currentRecipe);
    this.favoriteList.splice(indexFavorite, 1);
    this.http.get('https://gruppe4.testsites.info/api/Favorites/Remove/' + user + '/' + currentRecipe, {headers: headers}).subscribe(result => {alert('Rezept wurde als Favorit entfernt')});
    }
  }

  fillTemplateRecipe(recipe: any): string{
    var autor = recipe.Username;
    var rezeptname = recipe.Rezeptname;
    var imgSrc = recipe.PictureEncoded;
    var score = '';
    if (isNaN(recipe.Score)){
      score ='-';
    } else if (recipe.Score < 0.4){
      score = '☆☆☆☆☆';
    } else if (recipe.Score < 1.4){
      score = '★☆☆☆☆';
    } else if (recipe.Score < 2.4){
      score = '★★☆☆☆';
    } else if (recipe.Score < 3.4){
      score = '★★★☆☆';
    } else if (recipe.Score < 4.4){
      score = '★★★★☆';
    } else {
      score = '★★★★★';
    }
    let templateString = `  <div class ="rezept">\n` +
      `    <img style="float: left; margin-right: 50px"src=${imgSrc} width="100">\n` +
      `      <table>\n` +
      `        <tr>\n` +
      `          <td>    <label>\n` +
      `        <b>${rezeptname}</b>     <input type="checkbox" class="favorite" style="margin-left: 40px">♡</input>\n` +
      `          </label></td>\n` +
      `        </tr>\n` +
      `        <tr>\n` +
      `          <td>    <label>${score}</label></td>\n` +
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
    return templateString;
  }
  add(): void{
    this.router.navigateByUrl('recipes');
  }
}

