import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayWeatherComponent } from './day-weather/day-weather.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShortDayPipe } from './shared/pipes/short-day.pipe';

@NgModule({
  declarations: [AppComponent, DayWeatherComponent, ShortDayPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DatePipe,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [ShortDayPipe],
})
export class AppModule {}
