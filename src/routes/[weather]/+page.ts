import type { Fivedayforecast } from '$lib/types/FivedayWeatherType';
import type { Weathertype } from '$lib/types/Weathertype';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	let navError = false;
	let currentWeather: Weathertype | null = null;
	let Fivedayforecast: Fivedayforecast | null = null;
	if (params.weather.split('_').length !== 4) {
		navError = true;
		throw error(404, { message: 'page not Found' });
	}
	const lat = params.weather.split('_')[2].split(':')[1];
	const lon = params.weather.split('_')[3].split(':')[1];
	try {
		const cur = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}4&lon=${lon}4&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
		);
		const re = await cur.json();
		currentWeather = re;
	} catch (error) {
		throw new Error('error');
		console.log(error);
	}
	try {
		const cur = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
		);
		const re = await cur.json();
		// console.log(re);
		Fivedayforecast = re;
	} catch (error) {
		throw new Error('error');
		console.log(error);
	}

	return {
		currentWeather,
		Fivedayforecast,
		navError
	};
}) satisfies PageLoad;
