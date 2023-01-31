import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DayCondition } from '../models/day-condition.model';
import { DayInWeek } from '../models/day-in-week.enum';
import { ReverseResponseCity } from '../models/reverse-response-city.model';
import { WeatherCondition } from '../models/weather-condition.enum';
import { OpenWeather } from '../models/weather-response';
import { Week } from '../utils/week.util';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  private mockedConditions: DayCondition[] = [
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: true,
      weatherCondition: WeatherCondition.cloudy,
      dayInWeek: DayInWeek.monday,
      degrees: 20,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.sunny,
      dayInWeek: DayInWeek.tuesday,
      degrees: 21,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.cloudy,
      dayInWeek: DayInWeek.wednesday,
      degrees: 22,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.rain,
      dayInWeek: DayInWeek.thurstday,
      degrees: 23,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.sunny,
      dayInWeek: DayInWeek.friday,
      degrees: 24,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.cloudy,
      dayInWeek: DayInWeek.saturday,
      degrees: 25,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
    {
      city: 'Zagreb',
      country: 'Croatia',
      active: false,
      weatherCondition: WeatherCondition.rain,
      dayInWeek: DayInWeek.saturday,
      degrees: 26,
      date: '',
      humidity: 0,
      precipitation: 0,
      wind: 0,
    },
  ];

  private activeDayChangedSubject = new BehaviorSubject<DayCondition>(
    this.mockedConditions[0]
  );
  activeDayChanged$ = this.activeDayChangedSubject.asObservable();

  private weatherConditionsSubject = new BehaviorSubject<DayCondition[]>([]);
  weatherConditionsChanged$ = this.weatherConditionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private replace(
    word: string,
    searchWhat: string,
    replaceWith: string
  ): string {
    return word.split(searchWhat).join(replaceWith);
  }

  private getWeatherUrl(city: string, country: string): string {
    let url = this.replace(
      environment.baseWeatherUrl,
      '{API_KEY}',
      environment.weatherApiKey
    );
    url = this.replace(url, '{CITY_ID}', city);
    url = this.replace(url, '{COUNTRY_ID}', country);
    return url;
  }

  private getReverseUrl(lon: number, lat: number): string {
    let url = this.replace(
      environment.baseReverseUrl,
      '{API_KEY}',
      environment.weatherApiKey
    );
    url = this.replace(url, '{LON}', lon.toString());
    url = this.replace(url, '{LAT}', lat.toString());
    return url;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    );
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  getWeatherCondition(remoteCondition: string): WeatherCondition {
    switch (remoteCondition) {
      case 'Clear':
        return WeatherCondition.sunny;
      case 'Rain':
        return WeatherCondition.rain;
      default:
        return WeatherCondition.cloudy;
    }
  }

  getWeatherConditionsForDay(
    targetDate: Date,
    reports: Array<OpenWeather.DayReport>
  ): OpenWeather.DayReport {
    return reports.find((report) =>
      this.isSameDay(new Date(report.dt * 1000), targetDate)
    ) as OpenWeather.DayReport;
  }

  private convertDayReportToDayCondition(
    dayReport: OpenWeather.DayReport,
    city: string,
    country: string
  ): DayCondition {
    return {
      active: this.isToday(new Date(dayReport.dt * 1000)),
      date: dayReport.dt_txt,
      dayInWeek: this.weekday[new Date(dayReport.dt * 1000).getDay()],
      humidity: dayReport.main.humidity,
      precipitation: !!dayReport.rain ? Object.values(dayReport.rain)[0] : '0',
      wind: Math.trunc(dayReport.wind.speed),
      weatherCondition: this.getWeatherCondition(dayReport.weather[0].main),
      degrees: Math.ceil(dayReport.main.temp),
      city,
      country,
    } as DayCondition;
  }

  private addDays(targetDate: Date, days: number) {
    const clonedDate = new Date(targetDate.getTime());
    clonedDate.setDate(clonedDate.getDate() + days);
    return clonedDate;
  }

  getWeatherConditions$(
    city: string,
    country: string
  ): Observable<DayCondition[]> {
    const now = new Date();

    //return of(this.mockedConditions);

    return this.http
      .get<OpenWeather.WeatherResponse>(this.getWeatherUrl(city, country))
      .pipe(
        take(1),
        map((response) => {
          console.log('OpenWeather response received.');
          return [
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(now, response.list),
              city,
              country
            ),
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(
                this.addDays(now, 1),
                response.list
              ),
              city,
              country
            ),
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(
                this.addDays(now, 2),
                response.list
              ),
              city,
              country
            ),
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(
                this.addDays(now, 3),
                response.list
              ),
              city,
              country
            ),
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(
                this.addDays(now, 4),
                response.list
              ),
              city,
              country
            ),
            this.convertDayReportToDayCondition(
              this.getWeatherConditionsForDay(
                this.addDays(now, 5),
                response.list
              ),
              city,
              country
            ),
          ];
        })
      );
  }

  changeActiveDay(
    dayToActivate: DayCondition | null,
    allDays: DayCondition[]
  ): void {
    if (allDays.length === 0 || dayToActivate == null) {
      this.activeDayChangedSubject.next(this.mockedConditions[0]);
      return;
    }
    allDays.forEach((day) => {
      day.active = day.date === dayToActivate.date;
    });

    this.activeDayChangedSubject.next(dayToActivate);
  }

  getCity$(lon: number, lat: number): Observable<ReverseResponseCity> {
    return this.http
      .get<ReverseResponseCity[]>(this.getReverseUrl(lon, lat))
      .pipe(
        map((response) => {
          return response[0];
        })
      );
  }
}
