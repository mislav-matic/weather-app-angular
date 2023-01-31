import { DayInWeek } from './day-in-week.enum';
import { WeatherCondition } from './weather-condition.enum';

export interface DayCondition {
  city: string;
  country: string;
  date: string;
  precipitation?: number;
  humidity: number;
  wind: number;
  weatherCondition: WeatherCondition;
  dayInWeek: DayInWeek;
  degrees: number;
  active: boolean;
}
