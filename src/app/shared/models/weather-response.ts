export namespace OpenWeather {
  export interface Coord {
    lat: number;
    lon: number;
  }

  export interface City {
    coord: Coord;
    country: string;
    id: number;
    name: string;
    population: number;
    sunrise: number;
    sunset: number;
    timezone: number;
  }

  export interface Clouds {
    all: number;
  }

  export interface Main {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_kf: number;
    temp_max: number;
    temp_min: number;
  }

  export interface Sys {
    pod: string;
  }

  export interface Weather {
    description: string;
    icon: string;
    id: number;
    main: string;
  }

  export interface Wind {
    deg: number;
    gust: number;
    speed: number;
  }

  export interface DayReport {
    clouds: Clouds;
    dt: number;
    dt_txt: string;
    main: Main;
    pop: number;
    sys: Sys;
    visibility: number;
    weather: Weather[];
    wind: Wind;
    rain: number;
  }

  export interface WeatherResponse {
    city: City;
    cnt: number;
    cod: string;
    list: DayReport[];
    message: number;
  }
}
