import { FormControl } from '@angular/forms';

export function isEmail(control: FormControl): {[key: string]: boolean} | null {
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value)) {
        return null
    } else {
        return {isEmail: true}
    }
}
