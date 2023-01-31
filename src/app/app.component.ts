import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  catchError,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { DayCondition } from './shared/models/day-condition.model';
import { LoadingWeatherInfo } from './shared/models/loading-weather-info.enum';
import { WeatherService } from './shared/services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  loadState: LoadingWeatherInfo = LoadingWeatherInfo.loading;
  cities = [
    'Belgrade',
    'Berlin',
    'London',
    'Kyiv',
    'New York',
    'Moscow',
    'Paris',
    'Zagreb',
  ];
  dayConditions$ = new Observable<DayCondition[]>();
  activeDayChanged$ = new Observable<DayCondition>();
  locationInput: string = '';
  customLocationError = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.dayConditions$ = this.weatherService.weatherConditionsChanged$;
    this.activeDayChanged$ = this.weatherService.activeDayChanged$;
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.weatherService
              .getCity$(position.coords.longitude, position.coords.latitude)
              .pipe(
                take(1),
                switchMap((city) =>
                  this.getWeatherByCity$(city.name, city.country).pipe(
                    tap((conditions) => {
                      this.loadState = LoadingWeatherInfo.loaded;
                      this.weatherService.changeActiveDay(
                        conditions[0],
                        conditions
                      );
                      this.dayConditions$ = of(conditions);
                    })
                  )
                )
              )
              .subscribe();
          } else {
          }
        },
        (error: GeolocationPositionError) => console.log(error)
      );
    } else {
      this.dayConditions$ = this.getWeatherByCity$('New York', 'usa');
      alert('Geolocation is not supported by this browser.');
    }
  }

  getCustomLocation(): void {
    this.loadState = LoadingWeatherInfo.input;
  }

  applyLocation(): void {
    if (this.locationInput.indexOf(',') === -1) {
      this.customLocationError = true;
      return;
    }

    this.customLocationError = false;
    const locationParts = this.locationInput.split(',');
    const city = locationParts[0].trim();
    const country = locationParts[1].trim();

    this.loadState = LoadingWeatherInfo.loading;
    this.dayConditions$ = this.getWeatherByCity$(city, country);
  }

  private getWeatherByCity$(
    city: string,
    country: string
  ): Observable<DayCondition[]> {
    return this.weatherService.getWeatherConditions$(city, country).pipe(
      catchError((err) => {
        this.customLocationError = true;
        return of([]);
      }),
      tap((dayConditions) => {
        if (dayConditions?.length) {
          this.loadState = LoadingWeatherInfo.loaded;
          const active = dayConditions.find(
            (day) => day.active
          ) as DayCondition;
          this.weatherService.changeActiveDay(active, dayConditions);
          this.customLocationError = false;
        }
      })
    );
  }
}
