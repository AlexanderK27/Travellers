import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { countries, searchSelects } from 'src/app/shared/db';

export interface SearchQueryParams {
    equalTo: string;
    filterBy: string;
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    @Output() OnSearch: EventEmitter<SearchQueryParams> = new EventEmitter<
        SearchQueryParams
    >();

    authorInput = '';
    cityInput = '';
    countries = countries;
    searchSelects = searchSelects;
    searchCategory: string;
    searchValue: string;
    submitted = false;

    constructor() {}

    ngOnInit(): void {
        this.searchCategory = this.searchSelects.category.defaultOption().value;
        this.searchValue = this.searchSelects[
            this.searchCategory
        ].defaultOption().value;
    }

    setSeachValue(option: string) {
        this.searchValue = option;
    }

    setSearchCategory(option: string) {
        this.searchCategory = option;
    }

    submitForm() {
        const queryData = {
            filterBy: this.searchCategory,
            equalTo: this.searchValue,
        };

        if (this.searchCategory === 'author') {
            queryData.equalTo = this.authorInput;
        } else {
            queryData.filterBy = `filters/${queryData.filterBy}`;
        }

        if (this.searchCategory === 'city') {
            queryData.equalTo = this.cityInput.toLowerCase();
        }

        this.OnSearch.emit(queryData);
    }
}
