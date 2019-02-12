import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { FormControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
declare let jQuery: any;

@Component({
  selector: 'app-search-song',
  templateUrl: './search-song.component.html',
  styleUrls: ['./search-song.component.scss']
})
export class SearchSongComponent implements OnInit, OnDestroy {

  @Output() songSelected: EventEmitter<any>;

  public searchResults: Observable<Array<any>>;
  public queryField: FormControl;
  public defaultImage: string;
  public currentView: string = 'search';

  private unsubscribe: Subject<void>;

  constructor(private libraryService: LibraryService) {

    this.queryField = new FormControl();
    this.queryField.value = "a";
    console.log("queryField value =>",this.queryField.value;
    this.unsubscribe = new Subject<void>();
    // XXX: Just a placeholder for now!
    this.defaultImage = 'assets/images/drake-cover__large.png';
    this.songSelected = new EventEmitter<any>();

    this.searchResults = this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        mergeMap((value: any) => {
          return this.libraryService.search(value);
        })
      );
  }

public function showView(context): void {
      switch (context) {
          case 1:
              this.currentView = 'search';
              // #yourInput.value = '';
              break;
          case 2:
              this.currentView = 'artist';
              // #yourInput.value = ' ';
              break;
          case 3:
              this.currentView = 'album';
              // #yourInput.value = '';
              break;
      }
  }

  // ngOnInit() { }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  public chooseSong(song: any) {
    this.songSelected.emit(song);
    this.hideResults();
  }


  public showResults(): void {
    jQuery('#resultsWrapper').show();
  }


  public hideResults(): void {
    setTimeout(() => { jQuery('#resultsWrapper').hide(); }, 100);
  }

}
