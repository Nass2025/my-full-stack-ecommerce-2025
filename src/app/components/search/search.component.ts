import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,

  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {


  constructor(private router: Router) {
  }

  doSearch(info: string):void {
    console.log(`here is the value: ${info}`);
    this.router.navigateByUrl(`/search/${info}`);
  }

}
