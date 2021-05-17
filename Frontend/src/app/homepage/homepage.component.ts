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
  empty = true; // if true show the label 'Keine Rezepte vorhanden'
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

    // loads all users to get the ID and username of all possible friends
    http.get("https://gruppe4.testsites.info/" + 'api/Users', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.friendIDName.push({UserID: obj.userID, Name: obj.username});
      }
    }, error => console.error(error));

    // loads all categories into categoryList to be able to show them in the select
    http.get("https://gruppe4.testsites.info/" + 'api/Categories', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.categoryList.push(obj.name);
        this.categoryIDName.push({CategoryID: obj.categoryID, Name: obj.name});
      }
    }, error => console.error(error));

    //get all friends of the user and loads them into friendIDList
    http.get("https://gruppe4.testsites.info/" + 'api/Friends/' + this.userService.userData.userID, {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for (var i = 0; i < jsonResult.length; i++) {
        if (jsonResult[i].userID1 === this.userService.userData.userID) {
          this.friendIDList.push(jsonResult[i].userID2);
        } else {
          this.friendIDList.push(jsonResult[i].userID1);
        }
      }

      // loads the usernames of all friends
      for (var i = 0; i < this.friendIDList.length; i++) {
        http.get("https://gruppe4.testsites.info/" + 'api/Users/' + this.friendIDList[i], {responseType: 'json'}).subscribe(result => {
          const jsonResult = JSON.parse(JSON.stringify(result));
          this.friendList.push(jsonResult.username);
        });

      }

    }, error => console.error(error));
  }

  ngOnInit(): void {
    // if there is no user, navigate to login
    if (this.userService.userData.userID===null||this.userService.userData.userID===undefined){
       this.router.navigateByUrl('login');
     }

    // load all ratings and push them into ratingList
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

    // loads all reicpes
    this.http.get('https://gruppe4.testsites.info/api/Recipes').subscribe(result => {
      for (let i = 0; i < JSON.parse(JSON.stringify(result)).length; i++) {
        // calculates the average rating of a recipe
        let sum =0;
        let count =0;
        for (let j=0; j < this.ratingList.length; j++){
          if (this.ratingList[j].RecipeID === result[i].recipeID){
            count ++;
            sum += this.ratingList[j].Score;
          }
        }
        const avg = sum / count;

        // if there is a picture, use this as a source, if there is none use a default picture
        let imgSrc: string;
        if (result[i].pictureEncoded === null || result[i].pictureEncoded === '') {
          imgSrc = "https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
        } else {
          imgSrc = result[i].pictureEncoded;
        }

        // push all information of the result into recipeList
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
      // get username of the author of the recipe and push it into recipeList
      this.http.get('https://gruppe4.testsites.info/api/Users').subscribe(result => {
        for (let j = 0; j < JSON.parse(JSON.stringify(result)).length; j++) {
          for (let i = 0; i < this.recipeList.length; i++) {
            if (this.recipeList[i].UserID === JSON.parse(JSON.stringify(result))[j].userID) {
              this.recipeList[i].Username = JSON.parse(JSON.stringify(result))[j].username;
            }
          }
        }

        // for each recipe in the recipeList fill the template with the relevant information and add EventListeners to the buttons
        // --> then insert the template to the HTML
        var element = 0;
        for (let i = 0; i < this.recipeList.length; i++) {
          let template = this.fillTemplateRecipe(this.recipeList[i]);
          if ((this.friendIDList.includes(Number(this.recipeList[i].UserID)) && this.recipeList[i].Oeffentlich) || this.recipeList[i].UserID === this.userService.userData.userID) {
            const div = document.getElementById('searchresult');
            // if a recipe is added, empty gets false, so that the label 'Keine Rezepte vorhanden' is not shown
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
    // navigates to recipes and gets the current RecipeID from the recipeService to show the actual recipe
    this.router.navigateByUrl('recipes');
    this.recipeService.currentRecipe = currentRecipe;

    //if the recipe is not an own recipe, set the visibility of the edit and delete button to false
    for (let i=0; i<this.recipeList.length; i++){
      if (currentRecipe === Number(this.recipeList[i].RecipeID)){
        if (this.userService.userData.userID !== this.recipeList[i].UserID){
          this.recipeService.Visible = false;
        }
      }

    }
    // get all information of the current recipe and insert them into the relative elements
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

    // get all ingredients of the current recipe and insert them into the Ingredientlist
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

    // get all steps of the current recipe and insert them into the Sepslist
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

  // adds categories to the assignCategoryList, if it gets checked and removes it from the list if it gets unchecked
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

  // gets called when the filter button is clicked
  filter() {
    this.empty = true;
    // remove all recipes that are currently shown
    const recipes = document.getElementsByClassName('rezept');
    while(recipes[0]){
      document.getElementById('searchresult').removeChild(recipes[0]);
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    // gets all recipes that fit to the selected categories
    this.http.post('https://gruppe4.testsites.info/api/AssignCategories/getRecipesByCategories', this.assignCategoryList, {headers:headers}).subscribe(result => {
      var element = 0;
      for (var i = 0; i < this.recipeList.length; i++) {
        var show = false;
        this.filteredRecipes = result.toString().split(',').map(x => +x);
        // checks if the recipe is either of a friend or a own recipe
        if ((this.friendIDList.includes(Number(this.recipeList[i].UserID)) && this.recipeList[i].Oeffentlich) || this.recipeList[i].UserID === this.userService.userData.userID) {
          // shows recipes if it either fits to the selected recipes or if no categories are selected
          if (this.filteredRecipes.includes(this.recipeList[i].RecipeID) || this.assignCategoryList.length === 0) {
            // shows recipe if it either fits to the selected friends or if no friends are selected
            if (this.filterFriendList.includes(Number(this.recipeList[i].UserID)) || this.filterFriendList.length === 0) {
              // shows recipe if its either an own recipe or if it's a public recipe
              if (this.recipeList[i].UserID === this.userService.userData.userID || this.recipeList[i].Oeffentlich) {
                if ((document.getElementById('filterFavorite-input') as HTMLInputElement).checked) {
                  // shows recipe if favorite button is selected and the recipe is a favorite
                  if (this.favoriteList.includes(this.recipeList[i].RecipeID)) {
                    show = true;
                  }
                } else {
                  show = true;
                }
                // if show was set to true, show the recipe and add the template to the html, and add the eventListeners
                if (show) {
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
                  if (this.favoriteList.includes(this.recipeList[i].RecipeID)) {
                    (div.getElementsByTagName('input')[element] as HTMLInputElement).checked = true;
                  }
                  const index = element;
                  div.getElementsByTagName('input')[element].addEventListener('click', (e) => {
                    this.favorite(recipeID, userId, index);
                  });
                  element++;
                } else {
                  this.empty = true;
                }
              }
            }
          }
        }
      }
    });
  }
  // adds friends to the filterFriendList if it gets checked and removes it from the list if it gets unchecked
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

  // if favorite gets checked, post it as a Favorite, if it gets unchecked, remove it
  favorite(currentRecipe: number, user: string, index: number){
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

  // fill the template with the information of the recipe
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
  // is called when clicking the button 'Rezept hinzufügen' and navigates to recipes
  add(): void{
    this.router.navigateByUrl('recipes');
  }
}

