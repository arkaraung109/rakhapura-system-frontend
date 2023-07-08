import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page-navigator',
  templateUrl: './page-navigator.component.html',
  styleUrls: ['./page-navigator.component.css'],
})
export class PageNavigatorComponent implements OnInit {

  @Input('currentPage') inputCurrentPage = 1;
  @Input('totalPageCount') inputTotalPageCount = 1;
  inputBoxSize: number = 1;
  @Output() enterPaginationEvent = new EventEmitter<number>();

  ngOnInit(): void {
    this.inputBoxSize = `${this.inputCurrentPage}`.length;
  }

  previousPageBtnEvent() {
    let nextPageNumber = this.inputCurrentPage - 1;
    if(nextPageNumber == 0 || nextPageNumber == -1) return;
    else this.enterPaginationEvent.emit(nextPageNumber);
  }

  nextPageBtnEvent() {
    let nextPageNumber = this.inputCurrentPage + 1;
    if(nextPageNumber > this.inputTotalPageCount) return;
    else this.enterPaginationEvent.emit(nextPageNumber);
  }

  enter(event: any) {
    if(isNaN(event.target.value)) {
      return;
    }
    let enterdValue: number = parseInt(event.target.value);
    if(enterdValue < 1 || enterdValue > this.inputTotalPageCount) return;
    this.enterPaginationEvent.emit(enterdValue);
  }
  
}
