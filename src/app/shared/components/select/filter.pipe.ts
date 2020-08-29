import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from '../../interfaces';

@Pipe({
    name: 'filter',
})
export class FilterPipe implements PipeTransform {
    transform(options: SelectOption[], search: string = ''): SelectOption[] {
        if (!search.trim()) {
            return options;
        }

        return options.filter((option) =>
            option.title.toLowerCase().includes(search.toLowerCase())
        );
    }
}
