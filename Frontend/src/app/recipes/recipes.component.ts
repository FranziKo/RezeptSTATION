import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {FormControl} from "@angular/forms";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})


export class RecipesComponent implements OnInit {
  categories = new FormControl();
  categoryList: string[] = [];
  categoryIDName: {CategoryID: undefined, Name: string}[] = [];
  assignCategoryList: number[] = [];
  recipeData: any = {RecipeID: 0, Name: '', Difficulty: '', Duration: '5', Visible: false, UserID: 0, PictureEncoded: ''};
  ingredientData: {IngredientID: string, Name: string, RecipeID: number}[] = [];
  stepsData: {StepID: string, Number: number, describtion: string, RecipeID: number}[] = [];
  public newRecipe = 0;

  constructor(private http: HttpClient, private router: Router, private userService: UserService, public recipeService: RecipeService) {
    http.get("https://localhost:44357/" + 'api/Categories', {responseType: 'json'}).subscribe(result => {
      const jsonResult = JSON.parse(JSON.stringify(result));
      for(var i = 0; i < jsonResult.length; i++) {
        var obj = jsonResult[i];
        this.categoryList.push(obj.name);
        this.categoryIDName.push({CategoryID: obj.categoryID, Name: obj.name});
        console.log(this.categoryIDName);
      }
      /* if (result !== undefined){
        const list = document.getElementById('Zutatenliste');
        const ingredient = document.createElement('li');
        list.appendChild(ingredient);
        const text = document.createElement('label');
        text.textContent = result;
        ingredient.appendChild(text);
      } */
    }, error => console.error(error));
  }


  ngOnInit(): void {
     if (this.userService.userData.UserID === null) {
      this.router.navigateByUrl('login');
    }
  }

  edit(){
    console.log(this.userService.userData.userID);
    console.log("edit");
    const btn_edit = document.getElementById('edit');
    const btn_delete = document.getElementById('delete');
    const recipename = document.getElementById('rezeptname');
    recipename.setAttribute("contentEditable", 'true');
    btn_edit.style.display='none';
    btn_delete.style.display='none';
    const btn_speichern= document.getElementById('btn_save');
    const btn_abbrechen= document.getElementById('btn_cancel');
    btn_speichern.style.display = 'inline';
    btn_abbrechen.style.display = 'inline';
    const recipeData = document.getElementById('recipeData');
    recipeData.style.display='inline';
    const addIngredient = document.getElementById('btn_addIngredient')
    addIngredient.style.display = 'inline';
    addIngredient.addEventListener('click', (e) => {
      this.addIngredient();
    });
    const addAnweisung = document.getElementById('btn_addStep');
    addAnweisung.style.display = 'inline';
    addAnweisung.addEventListener('click', (e) => {
      this.addStep();
    })
    btn_speichern.addEventListener('click', (e) => {
      this.speichern();
    })
    btn_abbrechen.addEventListener('click', (e) => {
      this.abbrechen();
    })
    const tags= <HTMLElement> document.getElementsByClassName('mat-chip-list')[0];
    tags.style.display='none';
    const editTag1 = <HTMLElement> document.getElementsByClassName('mat-form-field')[0];
    const editTag2 = <HTMLElement> document.getElementsByClassName('mat-form-field')[1];
    // editTag1.style.display='block';
    // editTag2.style.display='block';
    const btn_addPic = document.getElementById('btn_addPic');
    // btn_addPic.style.display='block';
    console.log('currentRecipe:' +this.recipeService.currentRecipe);
    if (this.recipeService.currentRecipe !== undefined){
      this.http.get("https://localhost:44357/" + 'api/Recipes/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
        const jsonResult = JSON.parse(JSON.stringify(result));
        const name = document.getElementById('rezeptname');
        name.innerHTML = jsonResult.name;
        console.log(jsonResult.difficulty);
        (document.getElementById('difficulty') as HTMLInputElement).value = jsonResult.difficulty;
        (document.getElementById('duration') as HTMLInputElement).value = jsonResult.duration;
        if (jsonResult.visible){
          (document.getElementById('btn_visible') as HTMLInputElement).checked = true;
        }
        if (jsonResult.pictureEncoded === null || jsonResult.pictureEncoded === ''){
          const img = (document.getElementById('picture_meal')) as HTMLImageElement;
          img.src ="https://cdn.pixabay.com/photo/2013/04/01/21/30/photo-99135_1280.png";
        } else {
          const img = (document.getElementById('picture_meal')) as HTMLImageElement;
          img.src = jsonResult.pictureEncoded;
        }
        console.log(jsonResult);
      });
      const zutatenliste = document.getElementById('Zutatenliste').childElementCount;
      for (var i=0; i<zutatenliste-1; i++){
        const first = document.getElementById('Zutatenliste').firstChild;
        document.getElementById('Zutatenliste').removeChild(first);
      }
      const anweisungsliste = document.getElementById('Anweisungsliste').childElementCount;
      for (var i=0; i<anweisungsliste-1; i++){
        const first = document.getElementById('Anweisungsliste').firstChild;
        document.getElementById('Anweisungsliste').removeChild(first);
      }
      this.http.get("https://localhost:44357/" + 'api/Ingredients/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
        const jsonResult = JSON.parse(JSON.stringify(result));
        for (let i=0; i< jsonResult.length; i++){
          const list = document.getElementById('Zutatenliste');
          const last = list.lastChild;
          const ingredient = document.createElement('li');
          const text = document.createElement('input');
          text.value = jsonResult[i].name;
          text.textContent = jsonResult[i].ingredientID;
          list.insertBefore(ingredient, last);
          const btn_delete = document.createElement('button');
          btn_delete.textContent="X";
          btn_delete.style.marginLeft='10px';
          btn_delete.addEventListener('click', (e) => {
            this.deleteIngredient(e);
          })
          list.insertBefore(ingredient, list.lastChild)
          ingredient.appendChild(text);
          ingredient.appendChild(btn_delete);
        }
      });
      this.http.get("https://localhost:44357/" + 'api/Steps/Find/' + this.recipeService.currentRecipe, {responseType: 'json'}).subscribe(result => {
        const jsonResult = JSON.parse(JSON.stringify(result));
        for (let i=0; i< jsonResult.length; i++){
          const list = document.getElementById('Anweisungsliste');
          const last = list.lastChild;
          const step = document.createElement('li');
          const text = document.createElement('textarea');
          text.value = jsonResult[i].describtion;
          list.insertBefore(step, last);
          const btn_delete = document.createElement('button');
          btn_delete.textContent="X";
          btn_delete.style.marginLeft='10px';
          btn_delete.addEventListener('click', (e) => {
            this.deleteIngredient(e);
          })
          list.insertBefore(step, list.lastChild)
          step.appendChild(text);
          step.appendChild(btn_delete);
        }
      });
    }
  }

  addIngredient(){
    const list = document.getElementById('Zutatenliste');
    const ingredient = document.createElement('li');
    const text = document.createElement('input');
    const btn_delete = document.createElement('button');
    btn_delete.textContent="X";
    btn_delete.style.marginLeft='10px';
    btn_delete.addEventListener('click', (e) => {
      this.deleteIngredient(e);
    })
    list.insertBefore(ingredient, list.lastChild)
    ingredient.appendChild(text);
    ingredient.appendChild(btn_delete);
  }

  addStep(){
    const list = document.getElementById('Anweisungsliste');
    const step = document.createElement('li');
    const text = document.createElement('textarea');
    const btn_delete = document.createElement('button');
    btn_delete.textContent="X";
    btn_delete.style.marginLeft='10px';
    btn_delete.addEventListener('click', (e) => {
      this.deleteIngredient(e);
    })
    list.insertBefore(step, list.lastChild)
    step.appendChild(text);
    step.appendChild(btn_delete);

  }

  deleteIngredient(e){
   e.srcElement.parentNode.remove();
  }

  speichern(){
    const rezeptname = document.getElementById('rezeptname').textContent;
    this.recipeData.Name = rezeptname;
    this.recipeData.RecipeID = this.recipeService.currentRecipe;
    this.recipeData.Difficulty = (document.getElementById('difficulty') as HTMLInputElement).value;
    this.recipeData.Duration = (document.getElementById('duration') as HTMLInputElement).value;
    this.recipeData.Visible = (document.getElementById('btn_visible') as HTMLInputElement).checked;
    this.recipeData.UserID = this.userService.userData.userID;
    this.recipeData = JSON.stringify(this.recipeData);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    if (this.recipeService.currentRecipe === undefined) {
      this.http.post('https://localhost:44357/api/Recipes', this.recipeData, {headers: headers})
        .subscribe((recipe:{recipeID: number}) => {
          const ingredients = document.getElementById('Zutatenliste').childNodes;
          for (let i=0; i<ingredients.length-1; i++){
            const name = (ingredients[i].firstChild as HTMLInputElement).value;
            this.ingredientData.push({IngredientID: undefined, Name: name, RecipeID: recipe.recipeID});
            console.log(this.ingredientData[i]);
            this.http.post('https://localhost:44357/api/Ingredients', this.ingredientData[i], {headers: headers}).subscribe();
          }
          const steps = document.getElementById('Anweisungsliste').childNodes;
          for (let i=0; i<steps.length-1; i++){
            const name = (steps[i].firstChild as HTMLTextAreaElement).value;
            console.log({StepID: undefined, Number: i+1, describtion: name, RecipeID: recipe.recipeID});
            this.stepsData.push({StepID: undefined, Number: i+1, describtion: name, RecipeID: recipe.recipeID});
            this.http.post('https://localhost:44357/api/Steps', this.stepsData[i], {headers: headers}).subscribe();
          }
          for (let i=0; i<this.assignCategoryList.length; i++){
            console.log('CategoryID:' + this.assignCategoryList[i]);
            const body = {CategoryID: this.assignCategoryList[i], RecipeID: recipe.recipeID};
            console.log(body);
            this.http.post('https://localhost:44357/api/AssignCategories', body, {headers: headers}).subscribe();
          }
          this.router.navigateByUrl('homepage');
          alert("Rezept wurde gespeichert!");
        }, (() => alert("Rezept konnte nicht angelegt werden!")));
    } else {
      const body = this.recipeData;
       this.http.put('https://localhost:44357/api/Recipes/' + this.recipeService.currentRecipe, body, {headers: headers}).subscribe();
       // Updaten der Zutatenliste
       const list = document.getElementById('Zutatenliste');
      for (var i=0; i< list.childElementCount-1; i++){
        var ingredientID = list.childNodes[i].firstChild.textContent;
        var name = (list.childNodes[i].firstChild as HTMLInputElement).value;
        this.ingredientData.push({IngredientID: ingredientID, Name: name, RecipeID: this.recipeService.currentRecipe});
      }
      for (var i=0; i<this.ingredientData.length; i++){
        if (this.ingredientData[i].IngredientID !== ''){
          this.http.delete('https://localhost:44357/api/Ingredients/' + this.ingredientData[i].IngredientID, {headers: headers}).subscribe();
        }
        this.ingredientData[i].IngredientID= undefined;
        var data =this.ingredientData[i];
        this.http.post('https://localhost:44357/api/Ingredients', data, {headers: headers}).subscribe();
      }
      // Updaten der Anweisungsliste
      /* const aList = document.getElementById('Anweisungsliste');
      for (var i=0; i< aList.childElementCount-1; i++){
        var stepID = aList.childNodes[i].firstChild.textContent;
        var describtion = (aList.childNodes[i].firstChild as HTMLInputElement).value;
        this.stepsData.push({StepID: stepID, Number: i+1, describtion: describtion, RecipeID: this.recipeService.currentRecipe});
      } */
      this.http.get('https://localhost:44357/api/Steps/Find/' + this.recipeService.currentRecipe, {headers: headers}).subscribe(result => {
        const jsonResult = JSON.parse(JSON.stringify(result));
        for (var i=0; i<jsonResult.length; i++){
          this.http.delete('https://localhost:44357/api/Steps/' + jsonResult[i].stepID, {headers: headers}).subscribe();
        }
      });
      const steps = document.getElementById('Anweisungsliste').childNodes;
      for (let i=0; i<steps.length-1; i++){
        const name = (steps[i].firstChild as HTMLTextAreaElement).value;
        console.log({StepID: undefined, Number: i+1, describtion: name, RecipeID: this.recipeService.currentRecipe});
        this.stepsData.push({StepID: undefined, Number: i+1, describtion: name, RecipeID: this.recipeService.currentRecipe});
        this.http.post('https://localhost:44357/api/Steps', this.stepsData[i], {headers: headers}).subscribe();
      }
      //Updaten der Kategorien
      this.http.get('https://localhost:44357/api/AssignCategories/Find/' + this.recipeService.currentRecipe, {headers: headers}).subscribe( result =>
      {
        var categoryResult = JSON.parse(JSON.stringify(result));
        for (var i=0; i< categoryResult.length; i++){
          this.http.delete('https://localhost:44357/api/AssignCategories/' + categoryResult[i].assignCategoryId, {headers: headers}).subscribe();
        }
        for (let i=0; i<this.assignCategoryList.length; i++){
          const body = {CategoryID: this.assignCategoryList[i], RecipeID: this.recipeService.currentRecipe};
          this.http.post('https://localhost:44357/api/AssignCategories', body, {headers: headers}).subscribe();
        }
      }
      );
    }


    const btn_edit = document.getElementById('edit');
    const btn_delete = document.getElementById('delete');
    const btn_save = document.getElementById('btn_save');
    const btn_cancel = document.getElementById('btn_cancel');
    const btn_addIngredient = document.getElementById('btn_addIngredient');
    const btn_addStep = document.getElementById('btn_addStep');
    const recipeData = document.getElementById('recipeData');

    recipeData.style.display='none';
    btn_edit.style.display='inline'
    btn_delete.style.display='inline'
    btn_save.style.display='none';
    btn_cancel.style.display='none';
    btn_addIngredient.style.display='none';
    btn_addStep.style.display='none';
    const tags= <HTMLElement> document.getElementsByClassName('mat-chip-list')[0];
    tags.style.display='block';
    const editTag1 = <HTMLElement> document.getElementsByClassName('mat-form-field')[0];
    const editTag2 = <HTMLElement> document.getElementsByClassName('mat-form-field')[1];
    editTag1.style.display='none';
    editTag2.style.display='none';
    const btn_addPic = document.getElementById('btn_addPic');
    btn_addPic.style.display='none';
    this.recipeService.currentRecipe= undefined;

  }
  abbrechen(){
    const btn_edit = document.getElementById('edit');
    const btn_delete = document.getElementById('delete');
    const btn_save = document.getElementById('btn_save');
    const btn_cancel = document.getElementById('btn_cancel');
    const btn_addIngredient = document.getElementById('btn_addIngredient');
    const btn_addStep = document.getElementById('btn_addStep');
    btn_edit.style.display='inline'
    btn_delete.style.display='inline'
    btn_save.style.display='none';
    btn_cancel.style.display='none';
    btn_addIngredient.style.display='none';
    btn_addStep.style.display='none';
    const tags= <HTMLElement> document.getElementsByClassName('mat-chip-list')[0];
    tags.style.display='block';
    const editTag1 = <HTMLElement> document.getElementsByClassName('mat-form-field')[0];
    const editTag2 = <HTMLElement> document.getElementsByClassName('mat-form-field')[1];
    editTag1.style.display='none';
    editTag2.style.display='none';
    const btn_addPic = document.getElementById('btn_addPic');
    btn_addPic.style.display='none';
    const recipeData = document.getElementById('recipeData');
    recipeData.style.display='none';
    this.recipeService.currentRecipe= undefined;
  }
  post(){

  }
  uploadPicture(){
    const file = (document.getElementById('picture') as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.recipeData.PictureEncoded = reader.result;
      console.log(reader.result);
    };
  }

  getCategory(event: {
    isUserInput: any;
    source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        for (let i = 0; i< this.categoryIDName.length; i++){
          if(this.categoryIDName[i].Name === event.source.value){
            this.assignCategoryList.push(this.categoryIDName[i].CategoryID);
          }
        }
      } else {
        for (let i = 0; i< this.categoryIDName.length; i++){
          if(this.categoryIDName[i].Name === event.source.value){
            for (let j=0; j<this.assignCategoryList.length; j++){
              if (this.assignCategoryList[j] === this.categoryIDName[i].CategoryID){
                delete this.assignCategoryList[j];
              }
            }
          }
        }
      }
    }
  }
  deleteRecipe(){
    var recipeID = this.recipeService.currentRecipe;
    this.http.delete('https://localhost:44357/api/Recipes/' + recipeID)
      .subscribe((data) => {
        console.log(data);
        alert ('Rezept wurde gelöscht!');
        this.router.navigateByUrl('homepage');
      });
  }

}
