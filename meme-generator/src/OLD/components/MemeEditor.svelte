<script lang="ts">
	import ImageUploader from './ImageUploader.svelte';
	import TextField from './TextField.svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	// Store to hold the uploaded image URL
	const uploadedImage: Writable<string | null> = writable(null);
	const textLayers = writable([
		{ id: 1, text: 'Sample Text', x: 50, y: 50, fontSize: 24, color: '#FFF' }
	]);

	// Handlers
	const handleImageUpload = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => uploadedImage.set(reader.result as string);
		reader.readAsDataURL(file);
	};

	const addTextLayer = () => {
		textLayers.update((layers) => [
			...layers,
			{ id: Date.now(), text: 'New Text', x: 50, y: 50, fontSize: 24, color: '#FFF' }
		]);
	};
</script>

<div class="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 shadow-md">
	<h1 class="text-2xl font-bold text-gray-700">Meme Editor</h1>
	<ImageUploader onImageUpload={handleImageUpload} />

	{#if $uploadedImage}
		<div class="mt-4">
			<h2 class="mb-2 text-lg font-medium text-gray-600">Uploaded Image:</h2>
			<div class="overflow-hidden rounded-md border shadow">
				<img src={$uploadedImage} alt="Uploaded meme" class="w-full" />
			</div>
		</div>
	{/if}
	<button
		on:click={addTextLayer}
		class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
	>
		Add Text Layer
	</button>
</div>

<style>
	img {
		max-width: 100%;
		height: auto;
	}
</style>
