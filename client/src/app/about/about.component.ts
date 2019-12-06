import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  num: number = 0;
  newNum: number = 1000;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 4,
  };

  constructor() { }

  ngOnInit() {
  }

}
