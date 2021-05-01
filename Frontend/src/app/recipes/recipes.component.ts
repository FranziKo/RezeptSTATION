import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {FormControl} from "@angular/forms";

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
  recipeData: any = {RecipeID: undefined, Name: '', Difficulty: '', Duration: 5, Visible: false, UserID: null, PictureEncoded: ''};
  ingredientData: {IngredientID: undefined, Name: string, RecipeID: number}[] = [];
  stepsData: {StepID: undefined, Number: number, describtion: string, RecipeID: number}[] = [];

 /* constructor(private http: HttpClient) {
    http.get("https://localhost:44336/" + 'api/TodoItems', { responseType: 'text'}).subscribe(result => {
      console.log("Result:" + result);
      if (result !== undefined){
        this.recipe = result;
        const list = document.getElementById('Zutatenliste');
        const ingredient = document.createElement('li');
        list.appendChild(ingredient);
        const text = document.createElement('label');
        text.textContent = result;
        ingredient.appendChild(text);
        console.log("Recipe:" + this.recipe);
      }
    }, error => console.error(error));
  } */

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
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
    editTag1.style.display='block';
    editTag2.style.display='block';
    const btn_addPic = document.getElementById('btn_addPic');
    btn_addPic.style.display='block';

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
    console.log(document.getElementById('categories').childNodes);
    const rezeptname = document.getElementById('rezeptname').textContent;
    this.recipeData.Name = rezeptname;
    this.recipeData.UserID = 1;
    this.recipeData.Difficulty = (document.getElementById('difficulty') as HTMLInputElement).value;
    this.recipeData.Duration = parseInt((document.getElementById('duration') as HTMLInputElement).value);
    this.recipeData.Visible = (document.getElementById('btn_visible') as HTMLInputElement).checked;

    //const user = this.userService.userData.UserID;
    // this.recipeData.UserID = user;
    // console.log(user)
    this.recipeData = JSON.stringify(this.recipeData);
    console.log(this.recipeData);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
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

}
