<script lang="ts">
	import Currentweather from '$lib/components/Currentweather.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import type { Fivedayforecast } from '$lib/types/FivedayWeatherType';
	import type { Weathertype } from '$lib/types/Weathertype';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let lat = 0;
	let long = 0;
	let loc = false;
	let weatherDetails: Weathertype | null = null;
	let newdate: Date;
	let loading = false;
	let transform = 0;
	let five: Fivedayforecast | null = null;
	let location = true;
	let count = 0;
	$: fivedaylength = 0;
	onMount(async () => {
		weatherDetails = null;
		loading = true;
		if (navigator.geolocation) {
			loc = true;
			const coordinates = navigator.geolocation.getCurrentPosition(async (p) => {
				lat = p.coords.latitude;
				long = p.coords.longitude;
				const cur = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${lat}4&lon=${long}4&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
				);
				const re = await cur.json();

				weatherDetails = re;
			});
		} else {
			location = false;
		}
		loading = false;
	});

	onMount(() => {
		loc = true;
		loading = true;
		const coordinates = navigator.geolocation.getCurrentPosition(async (p) => {
			lat = p.coords.latitude;
			long = p.coords.longitude;
			const cur = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
			);
			const re = await cur.json();
			// console.log(re);
			five = re;
		});
		loading = false;
	});
	// $: fivedayforecast=five;

	$: if (weatherDetails?.dt !== undefined) {
		newdate = new Date(weatherDetails?.dt.valueOf() * 1000);
	}
	$: date = newdate;

	$: if (five !== null) {
		fivedaylength = five.list.length;
		five.list.forEach((l, i) => {
			let date = new Date(l.dt.valueOf() * 1000);
			l.dt = date;
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
	{:else if location}
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
{:else}
	<main>
		<h1>Sorry please enable your location to know the weather of this place</h1>
	</main>
{/if}
