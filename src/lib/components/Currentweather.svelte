<script lang="ts">
	import { BAASE_IMAGE_URL, days } from '$lib/constants/consts';
	import type { Citytype } from '$lib/types/FivedayWeatherType';
	import type { Weathertype } from '$lib/types/Weathertype';

	export let weatherDetails: Weathertype;
	export let Date: Date;
	export let cityDetails: Citytype;
</script>

<main class="flex w-full flex-col flex-wrap gap-4 bg-white p-5">
	<header class="flex flex-wrap items-center justify-between px-2 md:px-4">
		{#if weatherDetails.name === undefined}
			<h1>{cityDetails.name} <span>({cityDetails.country})</span></h1>
		{:else}
			<h1>{weatherDetails.name} <span>({weatherDetails.sys.country})</span></h1>
		{/if}
		<div class="flex">
			<div class="flex">
				<h1 class="font-semibold">{days[Date?.getDay()] + ','}</h1>
			</div>
			<div class="flex">
				<h1 class="font-semibold">{Date?.getHours() + ': '}</h1>
				<h1 class="font-semibold">
					{#if Date?.getMinutes() < 10}
						<span class="font-semi-bold">0{Date?.getMinutes()}</span>
					{:else}
						<span class="font-semibold">{Date?.getMinutes()}</span>
					{/if}
				</h1>
			</div>
		</div>
	</header>
	<div class="line_one flex flex-col justify-center gap-2 px-2 md:px-4">
		<div class="flex items-center">
			<h1 class="relative text-2xl">
				{Math.trunc(weatherDetails.main.temp)}
				<sup class="absolute right-3 ml-2 text-xs font-bold">O</sup>C
			</h1>
			<img src={BAASE_IMAGE_URL + weatherDetails.weather[0].icon + '@2x.png'} alt="icon" />
		</div>
		<div class="description">
			<p class="capitalize">
				{weatherDetails.weather[0].description} feels like
				<span class="text-xl">
					{Math.trunc(weatherDetails.main.feels_like)} <sup class="font-bold">O</sup>C
				</span>
			</p>
		</div>
	</div>
	<div class="weather_other_details">
		<ul class="tablelabesl grid grid-cols-1 gap-2 sm:grid-cols-2">
			<li class="flex border-2 border-dotted border-black p-3">
				<p class="flex-1 capitalize">Humidity</p>
				<p>
					{weatherDetails.main.humidity}%
				</p>
			</li>
			<li class="flex border-2 border-dotted border-black p-3">
				<p class="flex-1 capitalize">Pressure</p>
				<p>
					{weatherDetails.main.pressure} hPa
				</p>
			</li>
			<li class="flex border-2 border-dotted border-black p-3">
				<p class="flex-1 capitalize">minimum temperature</p>
				<p>
					{Math.trunc(weatherDetails.main.temp_min)}
					<sup class="font-bold">O</sup>C
				</p>
			</li>
			<li class="flex border-2 border-dotted border-black p-3">
				<p class="flex-1 capitalize">maximum temperature</p>
				<p>
					{Math.trunc(weatherDetails.main.temp_max)}
					<sup class="font-bold">O</sup>C
				</p>
			</li>
			<li class="flex border-2 border-dotted border-black p-3">
				<p class="flex-1 capitalize">wind speed</p>
				<p>
					{Math.trunc(weatherDetails.wind.speed)}M/S
				</p>
			</li>
		</ul>
	</div>
</main>
