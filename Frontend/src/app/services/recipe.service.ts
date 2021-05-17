import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // holds what recipe is currently selected
  // and the value of visible, which indicates if the edit and delete button of a recipe is shown
  currentRecipe: number = undefined;
  Visible = true;
  constructor() {
  }


}
