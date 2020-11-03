import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { CardListComponent } from './card-list/card-list.component';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [HomePageComponent, CardListComponent, SearchComponent],
    imports: [CommonModule, SharedModule],
})
export class HomePageModule {}
