import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  num: number = 0;
  newNum: number = 1000;
  numOrders: number = 57000;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 4,
  };

  option2 = {
    startVal: this.num,
    useEasing: true,
    duration: 6,
  };

  constructor() { }

  ngOnInit() {
  }

}
