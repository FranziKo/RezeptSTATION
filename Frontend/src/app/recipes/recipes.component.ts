import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  edit(){
    const btn_edit = document.getElementById('edit');
    const btn_delete = document.getElementById('delete');
    btn_edit.style.display='none';
    btn_delete.style.display='none';
    const btn_speichern= document.getElementById('btn_save');
    const btn_abbrechen= document.getElementById('btn_cancel');
    btn_speichern.style.display = 'inline';
    btn_abbrechen.style.display = 'inline';
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
  }

}
