import {
    Component,
    Input,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { PlanCard } from 'src/app/shared/interfaces';
import { interval, Subscription, fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements AfterViewInit, OnDestroy {
    @Input() posts: PlanCard[];
    @ViewChild('cardListBlock') listRef: ElementRef;

    displayScrollBtn$: Observable<boolean>;

    private cardWidth: number;
    private listEl: HTMLElement;

    constructor() {}

    ngAfterViewInit(): void {
        this.listEl = this.listRef.nativeElement;
        this.cardWidth = this.listEl.children[0].clientWidth;

        this.displayScrollBtn$ = fromEvent(this.listEl, 'scroll').pipe(
            map(({ target }) => (target['scrollLeft'] > 400 ? true : false))
        );
    }

    scrollCardList(scrollBack?: boolean): void {
        const scrolled: number = this.listEl.scrollLeft;

        // when scrolling back, check if the minimum scroll has not been reached
        if (scrollBack) {
            if (scrolled === 0) return;

            this.listEl.scrollLeft = scrolled - this.cardWidth;
        }
        // when scrolling forward, check if the maximum scroll has not been reached
        else if (
            scrolled + this.listEl.clientWidth !==
            this.listEl.scrollWidth
        ) {
            this.listEl.scrollLeft = scrolled + this.cardWidth;
        }
    }

    scrollToBeginning(): void {
        let scrolled = this.listEl.scrollLeft;

        // smooth scroll
        const sub$ = interval(10).subscribe((_) => {
            scrolled -= 10;

            this.listEl.scrollLeft = scrolled;

            if (scrolled <= 0) {
                sub$.unsubscribe();
            }
        });
    }

    ngOnDestroy(): void {}
}
