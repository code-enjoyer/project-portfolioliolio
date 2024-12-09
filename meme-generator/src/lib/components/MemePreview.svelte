<script lang="ts">
	import { stagedTemplate } from '$lib/stores/memeStore';
    import { onMount } from 'svelte';

	let isDragging = false;
	let currentIndex: number | null = null;

	// Track the initial position during dragging
	let startX = 0;
	let startY = 0;

	let container: HTMLDivElement | null = null;
    let containerWidth = 0;
    let containerHeight = 0;

	// TODO: #6 Add variable for current scale (and have it dynamically update)
	// The text fields are also slightly off at the moment so need to fix that too :)

	const startDrag = (event: MouseEvent, index: number) => {
		isDragging = true;
		currentIndex = index;

		startX = event.clientX;
		startY = event.clientY;

		event.preventDefault();
	};

	const onDrag = (event: MouseEvent) => {
		if (!isDragging || currentIndex === null || !$stagedTemplate) return;

		const container = document.querySelector('.preview-container')?.getBoundingClientRect();
		if (!container) return;

		const dx = event.clientX - startX;
		const dy = event.clientY - startY;

		const newX = $stagedTemplate.textFields[currentIndex].x + dx;
		const newY = $stagedTemplate.textFields[currentIndex].y + dy;

		// Ensure the text stays within bounds
		if (newX >= 0 && newX <= container.width) {
			$stagedTemplate.textFields[currentIndex].x = newX;
			startX = event.clientX;
		}
		if (newY >= 0 && newY <= container.height) {
			$stagedTemplate.textFields[currentIndex].y = newY;
			startY = event.clientY;
		}
	};

	const stopDrag = () => {
		isDragging = false;
		currentIndex = null;
	};

	onMount(() => {
        // Register mouse listeners
		window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', stopDrag);

		// Get initial container dims
		if (container) {
			containerWidth = container.clientWidth;
			containerHeight = container.clientHeight;
		}

		// Register observer to update container dims
		const resizeObserver = new ResizeObserver(() => {
			if (container) {
				containerWidth = container.clientWidth;
				containerHeight = container.clientHeight;
			}
		});

		if (container) resizeObserver.observe(container);

        return () => {
			// Unregister mouse listeners
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', stopDrag);

			// Disconnect resize observer
			resizeObserver.disconnect();
        };
    });
</script>

<style>
	.preview-container {
		width: 100%;
        min-height: 360px;
		aspect-ratio: 16 / 9;
        margin: auto;
		border: 2px solid #ccc;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
		background-color: #f8f9fa;
        display: flex;
        justify-content: center;
        align-items: center;
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
        display: block;
	}

	.text-field {
		position: absolute;
		cursor: move;
		white-space: nowrap;
	}

    .text-selected {
        border: 1px dashed #007bff;
        background-color: rgba(0, 123, 255, 0.1);
    }
</style>

<div bind:this={container} class="preview-container">
	{#if $stagedTemplate?.image}
		<img src={$stagedTemplate.image} alt="Meme Preview" class="preview-image" />
		{#each $stagedTemplate.textFields as field, index}
			<div
                class:text-selected={currentIndex === index}
				class="text-field"
                role="button"
                tabindex="0"
				style="
                top: calc({field.y}px * {containerHeight / $stagedTemplate.height});
                left: calc({field.x}px * {containerHeight / $stagedTemplate.height});
                font-size: {field.fontSize}px;
                color: {field.color};
                font-family: Impact, Haettenschweiler;
                -webkit-text-stroke-width: 1px;
                -webkit-text-stroke-color: {field.strokeColor};
            "
				on:mousedown={(e) => startDrag(e, index)}
			>
				{field.text}
			</div>
		{/each}
    {:else}
        <p class="preview-container text-center text-gray-500">Upload an image to start designing your meme</p>
    {/if}
</div>