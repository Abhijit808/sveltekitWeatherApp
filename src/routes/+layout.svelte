<script lang="ts">
	import '../app.css';
	import type { placetype } from '$lib/types/Placetypes';
	import bgimg from '$lib/assets/unsplash_FIKD9t5_5zQ.svg';
	import { latitide } from '$lib/store/store';
	import { goto } from '$app/navigation';
	let searchcity: string = '';

	let places: placetype[][] = [];
	const debounce = (cb: Function, delay: number) => {
		let time: ReturnType<typeof setTimeout>;
		return (...args: any[]) => {
			clearTimeout(time);
			time = setTimeout(() => cb(args), delay);
		};
	};
	const handleSearchsubmit = debounce(async () => {
		const city = searchcity;

		if (searchcity.length > 0) {
			try {
				const fetchCoordinates = await fetch(
					`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${import.meta.env.VITE_OPENWEATHERAPI_KEY}`
				);
				const Coordinates = await fetchCoordinates.json();
				places = [];
				places = [...places, Coordinates];
			} catch (error) {
				throw new Error('error');
			}
		} else {
			places = [];
		}
	}, 1000);
	const getLatandLong = (lat: number, long: number, name: string) => {
		latitide.set({ lat: lat, lon: long });
		places = [];
		searchcity = '';
		goto(`/${name}`);
	};
	const handledblclick = () => {
		places = [];
	};
</script>

<main
	style="background-image: url({bgimg});"
	class="relative flex min-h-screen flex-col items-center gap-1 bg-cover bg-center bg-no-repeat"
	on:dblclick={handledblclick}
>
	<nav class="flex w-full flex-col items-center justify-center bg-white/30 p-2 backdrop-blur-xl">
		<div class="input_wrapper relative w-full sm:w-[80%] md:w-[50%]">
			<input
				type="text"
				class=" w-full rounded-md p-2 text-black focus:outline-none"
				placeholder="Search"
				bind:value={searchcity}
				on:input={handleSearchsubmit}
			/>

			<button
				class="absolute right-0 top-0 flex items-center justify-center rounded-r-md bg-black p-2"
			>
				<span class="material-symbols-outlined text-white"> {'search'} </span>
			</button>
		</div>
	</nav>
	{#if places.length > 0}
		<aside
			class=" absolute top-14 z-10 flex w-[80%] flex-col items-center justify-start bg-white px-4 py-2 md:w-[50vw]"
		>
			{#each places as place, i}
				{#each place as pl}
					<button
						class="flex w-full cursor-pointer items-center justify-start gap-2 border-b-2 border-b-teal-950 py-2"
						on:click={() =>
							getLatandLong(
								pl.lat,
								pl.lon,
								`${pl.name}_${pl.country}_lat:${pl.lat}_long:${pl.lon}`
							)}
					>
						<div>
							<span class="material-symbols-outlined flex items-center justify-center text-xl">
								location_on
							</span>
						</div>
						<p class="font-semibold">{pl.name}</p>
						{#if pl.state !== undefined}
							<p class="font-bold">{' , ' + pl.state}</p>
						{/if}
					</button>
				{/each}
			{/each}
		</aside>
	{/if}
	<main
		class="grid w-[96vw] flex-1 place-items-center gap-10 overflow-x-hidden sm:w-[80vw] md:w-[60vw]"
	>
		<slot />
	</main>
</main>
