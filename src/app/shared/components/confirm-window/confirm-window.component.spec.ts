import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmWindowComponent } from './confirm-window.component';

describe('ConfirmWindowComponent', () => {
    let component: ConfirmWindowComponent;
    let fixture: ComponentFixture<ConfirmWindowComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmWindowComponent],
        });

        fixture = TestBed.createComponent(ConfirmWindowComponent);
        component = fixture.componentInstance;
        component.settings = {
            confirmBtnText: 'Delete',
            doOnConfirm: () => {},
            message: 'Are you sure you want to delete your account?',
        };
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });

    it('should display text of the window`s message', () => {
        fixture.detectChanges();

        const de = fixture.debugElement.query(By.css('.window-message'));
        const el: HTMLElement = de.nativeElement;

        expect(el.textContent).toEqual(component.settings.message);
    });

    it('should emit close event when cancel method has been called', () => {
        let result = null;
        component.close.subscribe(() => (result = 1));

        component.cancel();
        expect(result).toBe(1);
    });

    it('should call incomming callback if confirm button has been pressed', () => {
        const spy = spyOn(component.settings, 'doOnConfirm');
        let btn = fixture.debugElement.query(By.css('.btn-danger'));

        btn.triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalled();
    });
});
