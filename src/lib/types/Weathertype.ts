interface coord {
	lat: number;
	lon: number;
}
interface maintype {
	feels_like: number;
	grnd_level: number;
	humidity: number;
	pressure: number;
	temp: number;
	temp_max: number;
	temp_min: number;
}
interface Weatherdesctype {
	description: string;
	icon: string;
	main: string;
}
interface Windtype {
	deg: number;
	gust: number;
	speed: number;
}
interface Systype {
	country: string;
	sunrise: number;
	sunset: number;
}
export interface Weathertype {
	id: number;
	coord: coord;
	dt: Date;
	main: maintype;
	name: string;
	sys: Systype;
	weather: Weatherdesctype[];
	wind: Windtype;
	dt_txt: string;
}
