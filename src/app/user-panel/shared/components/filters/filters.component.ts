import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Filters } from 'src/app/shared/interfaces';
import { searchSelects } from 'src/app/shared/db';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
    @Input() values: Filters;
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    searchSelects = searchSelects;
    form: FormGroup;

    constructor() {}

    ngOnInit(): void {
        this.form = new FormGroup({
            continent: new FormControl(this.values.continent),
            country: new FormControl(this.values.country),
            city: new FormControl(this.values.city, [Validators.maxLength(30)]),
            duration: new FormControl(this.values.duration),
            amountCountries: new FormControl(this.values.amountCountries),
            amountCities: new FormControl(this.values.amountCities),
            people: new FormControl(this.values.people),
            budget: new FormControl(this.values.budget),
        });

        this.form.valueChanges.subscribe((value) => {
            this.onSelect.emit(value);
        });
    }
}
