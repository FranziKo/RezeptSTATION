import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  currentRecipe: number = undefined;
  Visible = true;
  constructor() {
  }


}
