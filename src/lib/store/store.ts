import { writable } from 'svelte/store';

export const latitide = writable({
	lat: 0,
	lon: 0
});
