<script lang="ts">
	import type { MemeImageField } from '$lib/models/meme-image-field';
	import type { MemeTextField } from '$lib/models/meme-text-field';
	import { stagedTemplate } from '$lib/stores/memeStore';
    import { onMount } from 'svelte';

	let isDragging = false;
	let currentIndex: number | null = null;

	// Track the initial position during dragging
	let startX = 0;
	let startY = 0;

	// We also need to track the current scale (width )
	let scaleX = 1;
	let scaleY = 1;

	let container: HTMLDivElement | null = null;
    let containerWidth = 0;
    let containerHeight = 0;

	// The text fields are also slightly off at the moment so need to fix that too :)

	const startDrag = (event: MouseEvent, index: number) => {
		isDragging = true;
		currentIndex = index;

	// Adjust for the container's scale
	const containerRect = container?.getBoundingClientRect();
	if (containerRect) {
		scaleX = containerRect.width / (container?.offsetWidth ?? 1);
		scaleY = containerRect.height / (container?.offsetHeight ?? 1);

		startX = (event.clientX - containerRect.left) / scaleX;
		startY = (event.clientY - containerRect.top) / scaleY;
	}

		event.preventDefault();
	};

// Called while dragging
const onDrag = (event: MouseEvent) => {
	if (!isDragging || currentIndex === null || !$stagedTemplate) return;

	const containerRect = container?.getBoundingClientRect();
	if (!containerRect) return;

	// Get current mouse position, scaled to canvas
	const currentMouseX = (event.clientX - containerRect.left) / scaleX;
	const currentMouseY = (event.clientY - containerRect.top) / scaleY;

	// Calculate delta
	const dx = currentMouseX - startX;
	const dy = currentMouseY - startY;

	var currentField;

	const eventTarget = event.target as HTMLElement;


	if (eventTarget.classList.contains('text-field')) {
		 currentField = {...$stagedTemplate.textFields[currentIndex]}
	}
	 else  {
		 currentField = {...$stagedTemplate.imageFields[currentIndex]};
	 }

	// Update field position, ensuring bounds
	const newX = Math.max(0, Math.min(containerRect.width, currentField.x + dx));
	const newY = Math.max(0, Math.min(containerRect.height, currentField.y + dy));

	// Apply the updated position
	currentField.x = newX;
	currentField.y = newY;

	// Update start coordinates for next movement
	startX = currentMouseX;
	startY = currentMouseY;

	if (eventTarget.classList.contains('text-field')) {
		$stagedTemplate.textFields = [...$stagedTemplate.textFields.slice(0, currentIndex),
		currentField as MemeTextField,
  		...$stagedTemplate.textFields.slice(currentIndex + 1)];
	}
	 else  {
		$stagedTemplate.imageFields = [...$stagedTemplate.imageFields.slice(0, currentIndex),
		currentField as MemeImageField,
  		...$stagedTemplate.imageFields.slice(currentIndex + 1)];
	 }
};


	const stopDrag = () => {
		isDragging = false;
		currentIndex = null;
	};

	onMount(() => {
        // Register mouse listeners
		container?.addEventListener('mousemove', onDrag);
        container?.addEventListener('mouseup', stopDrag);

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
            container?.removeEventListener('mousemove', onDrag);
            container?.removeEventListener('mouseup', stopDrag);

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

	.image-container {
		position: relative;
	}

	.preview-image {
		height: 100%;
        display: block;
	}

	.text-field, .image-field {
		position: absolute;
		cursor: move;
		white-space: nowrap;
	}

    .text-selected {
        border: 1px dashed #007bff;
        background-color: rgba(0, 123, 255, 0.1);
    }
</style>

<div class="preview-container">
	<div id="imageContainer" bind:this={container} class="image-container">
	{#if $stagedTemplate?.image}
		<img src={$stagedTemplate.image} alt="Meme Preview" class="preview-image" />
		{#each $stagedTemplate.textFields as field, index}
			<div
                class:text-selected={currentIndex === index}
				class="text-field"
                role="button"
                tabindex="0"
				style="
                top: calc({field.y}px);
                left: calc({field.x}px);
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
		{#each $stagedTemplate.imageFields as imageField, index}
		<div 
		role="button"
		tabindex="0"
		class:text-selected={currentIndex === index}
		on:mousedown={(e) => startDrag(e, index)}>
		<img
			src={imageField.image} 
			alt="image-${index}"
			class="image-field"
			style="
			top: calc({imageField.y}px);
			left: calc({imageField.x}px);
		"
		/>
	</div>
	{/each}
    {:else}
        <p class="text-center text-gray-500">Upload an image to start designing your meme</p>
    {/if}
</div>
</div>