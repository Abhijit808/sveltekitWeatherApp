<script lang="ts">
	export let data;
	import Currentweather from '$lib/components/Currentweather.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { latitide } from '$lib/store/store';
	import type { Fivedayforecast } from '$lib/types/FivedayWeatherType';
	import type { Weathertype } from '$lib/types/Weathertype';
	let weatherDetails = data.currentWeather;
	let loading = false;
	let five = data.Fivedayforecast;
	let newdate: Date;
	$: fivedaylength = 0;
	let count = 0;
	let transform = 0;
	latitide.subscribe(async (val) => {
		loading = true;

		if (val.lat !== 0) {
			const cur = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${val?.lat}4&lon=${val?.lon}4&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
			);
			const re = await cur.json();

			weatherDetails = re;
		}
		if (val.lat !== 0) {
			const cur = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${val?.lat}&lon=${val?.lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
			);
			const re = await cur.json();
			// console.log(re);
			five = re;
		}
		loading = false;
	});
	$: if (weatherDetails?.dt !== undefined) {
		newdate = new Date(weatherDetails?.dt.valueOf() * 1000);
	}
	$: date = newdate;

	$: if (five !== null) {
		fivedaylength = five.list.length;
		five.list.forEach((l, i) => {
			let date = new Date(l.dt.valueOf() * 1000);
			l.dt = date;

			// console.log(l.dt, i);
		});
	}
	const handlecarouselclick = (direction: string) => {
		if (direction === 'left') {
			count--;
			if (count <= 0) {
				count = five!.list.length - 1;
			}
			transform = count * 100;
		}
		if (direction === 'right') {
			count++;
			if (count >= five!.list.length) {
				count = 0;
			}
			transform = count * 100;
		}
	};
</script>

{#if weatherDetails !== null && five !== null}
	{#if loading}
		<Loading />
	{:else}
		<Currentweather {weatherDetails} Date={date} cityDetails={five.city} />
		<main
			class=" relative flex w-full flex-col items-center justify-center overflow-hidden bg-white p-4"
		>
			<button
				class=" right items center absolute right-0 top-60 z-10 flex rounded-xl bg-black p-2 text-white md:top-60"
				on:click={() => handlecarouselclick('right')}
				><span class="material-symbols-outlined"> arrow_forward </span></button
			>
			<button
				class="left items center absolute left-0 top-60 z-10 flex rounded-xl bg-black p-2 text-white md:top-60"
				on:click={() => handlecarouselclick('left')}
				><span class="material-symbols-outlined"> arrow_back </span></button
			>

			<div
				style="transform: translateX(-{transform}%);"
				class="  rounded-box mx-auto flex w-full items-center transition-all md:flex-row"
			>
				{#each five.list as weatherDetails, i}
					<div class="carousel-item w-full flex-col">
						<h2 class="m-4 border-b-2 border-black pb-4 text-2xl font-bold capitalize">
							Forecast for every 3 hours of {weatherDetails.dt.getDay() === 0
								? 'Today'
								: 'day ' + weatherDetails.dt.getDay()}
						</h2>
						<Currentweather {weatherDetails} Date={weatherDetails.dt} cityDetails={five.city} />
					</div>
				{/each}
			</div>
		</main>
	{/if}
{/if}
