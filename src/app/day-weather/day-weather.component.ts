import { Component, Input } from '@angular/core';
import { DayCondition } from '../shared/models/day-condition.model';
import { WeatherCondition } from '../shared/models/weather-condition.enum';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'app-day-weather',
  templateUrl: './day-weather.component.html',
  styleUrls: ['./day-weather.component.scss'],
})
export class DayWeatherComponent {
  @Input()
  dayCondition!: DayCondition;

  @Input()
  allDays!: DayCondition[];

  constructor(private weatherService: WeatherService) {}

  getImage(): string {
    return `../assets/images/${this.dayCondition.weatherCondition}.png`;
  }

  changeActiveDate(): void {
    this.weatherService.changeActiveDay(this.dayCondition, this.allDays);
  }
}
