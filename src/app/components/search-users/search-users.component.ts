import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent {
  protected searchUsersForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    
  }
  ngOnInit():void{
    this.createSearchUsersFrom();
  }

  createSearchUsersFrom() {
    this.searchUsersForm = this.formBuilder.group({
      "searchtext": ["", [Validators.required, Validators.minLength(3)]],
    })
  }

  search(){
    let loginModel = Object.assign({}, this.searchUsersForm.value);
  }

  onSubmit(): void {
    if (!this.searchUsersForm.valid)
      return;
    this.search();
  }
}
