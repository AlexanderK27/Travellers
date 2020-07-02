import { FormControl, FormGroup } from '@angular/forms';

export function isEmail(control: FormControl): {[key: string]: boolean} | null {
    if (control.value === null) return null
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(control.value) || control.value.trim() === '')
            ? null
            : {isEmail: true}
}

export function doPasswordsMatch(group: FormGroup): {[key: string]: boolean} | null {
    return group.get('password').value === group.get('confirmPass').value
        ? null
        : {mismatch: true}
}
