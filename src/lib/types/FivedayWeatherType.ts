import type { Weathertype } from './Weathertype';

export interface Citytype {
	coord: {
		lat: number;
		lon: number;
	};
	country: string;
	name: string;
}

export interface Fivedayforecast {
	city: Citytype;
	list: Weathertype[];
}
