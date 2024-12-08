<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let text: string = 'Sample Text';
	export let x: number = 50; // Initial x position
	export let y: number = 50; // Initial y position
	export let fontSize: number = 24;
	export let color: string = '#000';

	let editable = false;
	let textInput: HTMLDivElement;

	const startDrag = (event: MouseEvent) => {
		const offsetX = event.clientX - textInput.offsetLeft;
		const offsetY = event.clientY - textInput.offsetTop;

		const onMove = (moveEvent: MouseEvent) => {
			x = moveEvent.clientX - offsetX;
			y = moveEvent.clientY - offsetY;
		};

		const stopDrag = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', stopDrag);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', stopDrag);
	};

	const toggleEdit = () => {
		editable = !editable;
	};
</script>

<div
	bind:this={textInput}
	class="absolute cursor-move"
	style="top: {y}px; left: {x}px; font-size: {fontSize}px; color: {color};"
	on:dblclick={toggleEdit}
	on:mousedown={startDrag}
>
	{#if editable}
		<input
			type="text"
			bind:value={text}
			class="rounded border border-gray-300 bg-transparent px-2 py-1 text-center"
			on:blur={toggleEdit}
		/>
	{:else}
		<span>{text}</span>
	{/if}
</div>
