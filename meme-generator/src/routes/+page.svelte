<!-- <script lang="ts">
    import MemeEditor from "$lib/components/MemeEditor.svelte";
</script>
  
<div class="container mx-auto p-6">
    <MemeEditor />
</div>
   -->

<script lang="ts">
	import { templates, stagedTemplate } from '$lib/stores/memeStore';
	import type { MemeTemplate } from '$lib/models/meme-template';

	// Handle image uploads and stage the new template
	const handleFileUpload = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const reader = new FileReader();
			reader.onload = () => {
				stagedTemplate.set({
					image: reader.result as string,
					textFields: []
				});
			};
			reader.readAsDataURL(input.files[0]);
		}
	};

	// Add a new text field to the staged template
	const addTextField = () => {
		stagedTemplate.update((template: MemeTemplate | null) => {
			if (template) {
				template.textFields.push({
					text: '',
					x: 10,
					y: template.textFields.length * 40 + 10,
					fontSize: 24,
					color: '#ffffff',
					strokeColor: '#000000'
				});
			}
			return template;
		});
	};

	// Update a specific text field in the staged template
	const updateTextField = <K extends keyof MemeTemplate['textFields'][0]>(
		index: number,
		property: K,
		value: MemeTemplate['textFields'][0][K]
	) => {
		stagedTemplate.update((template) => {
			if (template) {
				template.textFields[index][property] = value;
			}
			return template;
		});
	};

	// Remove a text field from the staged template
	const removeTextField = (index: number) => {
		stagedTemplate.update((template) => {
			if (template) {
				template.textFields.splice(index, 1);
			}
			return template;
		});
	};

	// Save the staged template to the templates list
	const saveTemplate = () => {
		stagedTemplate.update((template) => {
			if (template) {
				templates.update((currentTemplates) => [...currentTemplates, template]);
				alert('Template saved!');
			}
			return null; // Clear the staged template after saving
		});
	};

	// Generate the final meme and trigger download
	const downloadMeme = async () => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Get the staged template
		const template = $stagedTemplate;
		if (!template) return;

		// Create an image object for the base image
		const img = new Image();
		img.src = template.image;

		await new Promise<void>((resolve) => {
			img.onload = () => {
				// Set canvas size to the image dimensions
				canvas.width = img.width;
				canvas.height = img.height;

				// Draw the image on the canvas
				ctx.drawImage(img, 0, 0, img.width, img.height);

				// Draw each text field
				template.textFields.forEach((field) => {
					ctx.font = `${field.fontSize}px sans-serif`;
					ctx.fillStyle = field.color;
					ctx.fillText(field.text, field.x, field.y);
				});

				resolve();
			};
		});

		// Convert the canvas to a downloadable image
		const link = document.createElement('a');
		link.download = 'meme.png';
		link.href = canvas.toDataURL('image/png');
		link.click();
	};
</script>

<div class="p-6">
	<h1 class="mb-6 text-center text-4xl font-bold">Meme Generator 3000</h1>

	<div class="flex flex-col items-center lg:flex-row">
		<!-- Meme preview -->
		<div class="w-full rounded-lg border bg-white p-4 shadow-lg lg:w-1/2">
			{#if $stagedTemplate?.image}
				<div class="relative">
					<img src={$stagedTemplate.image} alt="Staged Meme" class="w-full rounded-lg" />
					{#each $stagedTemplate.textFields as field, index}
						<div
							class="absolute"
							style="
                  top: {field.y}px;
                  left: {field.x}px;
                  font-size: {field.fontSize}px;
                  color: {field.color};
				  font-family: Impact, Haettenschweiler;
				-webkit-text-stroke-width: 1px;
  				-webkit-text-stroke-color: {field.strokeColor};
                "
						>
							{field.text}
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-gray-500">Upload an image to start designing your meme</p>
			{/if}
		</div>

		<!-- Control panel -->
		<div class="mt-6 lg:ml-6 lg:mt-0 lg:w-1/2">
			<h2 class="mb-4 text-xl font-semibold">Templates</h2>
			<div class="flex space-x-4 overflow-x-auto">
				<label
					class="cursor-pointer rounded-md border p-1 shadow ring-purple-500 transition hover:ring"
				>
					<input type="file" class="hidden" accept="image/*" on:change={handleFileUpload} />
					<div class="flex h-20 w-20 items-center justify-center rounded-md bg-gray-200">+</div>
				</label>
				{#each $templates as template, index}
					<button
						on:click={() => stagedTemplate.set(template)}
						class="rounded-md border p-1 shadow ring-purple-500 transition hover:ring"
					>
						<img
							src={template.image}
							alt={`Template ${index}`}
							class="h-20 w-20 rounded-md object-cover"
						/>
					</button>
				{/each}
			</div>

			{#if $stagedTemplate}
				<h2 class="mb-4 mt-6 text-xl font-semibold">Text Fields</h2>
				{#each $stagedTemplate.textFields as field, index}
					<div class="mb-4">
						<input
							type="text"
							class="mb-2 w-full rounded-md border p-2"
							bind:value={field.text}
							on:input={(e) => updateTextField(index, 'text', (e.target as HTMLInputElement).value)}
							placeholder="Enter text"
						/>
						<div class="flex space-x-2">
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								bind:value={field.x}
								on:input={(e) => updateTextField(index, 'x', +(e.target as HTMLInputElement).value)}
								placeholder="X"
							/>
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								bind:value={field.y}
								on:input={(e) => updateTextField(index, 'y', +(e.target as HTMLInputElement).value)}
								placeholder="Y"
							/>
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								bind:value={field.fontSize}
								on:input={(e) =>
									updateTextField(index, 'fontSize', +(e.target as HTMLInputElement).value)}
								placeholder="Font Size"
							/>
							<input
								type="color"
								class="w-10 rounded-md border p-1"
								bind:value={field.color}
								on:input={(e) =>
									updateTextField(index, 'color', (e.target as HTMLInputElement).value)}
							/>
							<input
							type="color"
							class="w-10 rounded-md border p-1"
							bind:value={field.strokeColor}
							on:input={(e) =>
								updateTextField(index, 'strokeColor', (e.target as HTMLInputElement).value)}
						/>
							<button
								class="ml-2 rounded-md bg-red-500 px-3 py-1 text-white"
								on:click={() => removeTextField(index)}
							>
								&#10005;
							</button>
						</div>
					</div>
				{/each}

				<button on:click={addTextField} class="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">
					Add another text field
				</button>

				<button
					on:click={downloadMeme}
					class="mt-4 block w-full rounded-md bg-purple-500 px-4 py-2 text-white"
				>
					Download Meme
				</button>

				<button
					on:click={saveTemplate}
					class="mt-4 block w-full rounded-md bg-green-500 px-4 py-2 text-white"
				>
					Save template
				</button>
			{/if}
		</div>
	</div>
</div>
