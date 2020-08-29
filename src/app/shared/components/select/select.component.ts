import {
    Component,
    OnChanges,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { SelectOption } from '../../interfaces';
import { SelectOptions } from '../../db';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnChanges {
    @Input() options: SelectOptions;
    @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

    isOpened = false;
    searchInputValue = '';
    selectedOption: SelectOption;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        this.selectedOption = changes.options.currentValue.defaultOption();
        this.searchInputValue = '';
    }

    closeSelect() {
        this.isOpened = false;
    }

    openSelect() {
        this.isOpened = true;
    }

    selectItem(option: SelectOption) {
        this.selectedOption = option;
        this.onSelect.emit(option.value);
        this.closeSelect();
    }
}
