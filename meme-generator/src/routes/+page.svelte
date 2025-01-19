<script lang="ts">
	import { templates, stagedTemplate } from '$lib/stores/memeStore';
	import MemePreview from '$lib/components/MemePreview.svelte';
	import type { MemeTemplate } from '$lib/models/meme-template';
	import type { MemeTextField } from '$lib/models/meme-text-field';

	let fileName: string = $state('');
	const fileTypeOptions = [
		{
			id: 0,
			text: 'PNG',
			value: 'image/png'
		},
		{
			id: 1,
			text: 'JPEG',
			value: 'image/jpeg'
		}
	];

	let selectedFileType = $state(fileTypeOptions[0]);

	// Handle image uploads and stage the new template
	const handleFileUpload = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const reader = new FileReader();
			reader.onload = (progressEvent: ProgressEvent<FileReader>) => {
				const img = new Image();
				img.onload = () => {
					stagedTemplate.set({
						image: progressEvent.target?.result as string,
						width: img.width,
						height: img.height,
						textFields: [],
						imageFields: []
					})
				};
				img.src = reader.result as string;
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

	const addImageField = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const reader = new FileReader();
			reader.onload = (progressEvent: ProgressEvent<FileReader>) => {
				const img = new Image();
				img.onload = () => {
					stagedTemplate.update((template: MemeTemplate | null) => {
			if (template) {
				template.imageFields.push({
					x: 10,
					y: template.textFields.length * 40 + 10,
					image: progressEvent.target?.result as string
				});
			}
			return template;
		})
				};
				img.src = reader.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
;	}

	// Update a specific text field in the staged template
	const updateTextField = <K extends keyof MemeTextField>(
		index: number,
		property: K,
		value: MemeTextField[K]
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

	// TODO: #4 The text is way off in the generated meme
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

				const container = document.getElementById('imageContainer');
				// Calculate scaling factor between preview and original dimensions
				const scaleX = img.width / (container?.offsetWidth ?? 1);
				const scaleY = img.height / (container?.offsetHeight ?? 1);
				// Draw the image on the canvas
				ctx.drawImage(img, 0, 0, img.width, img.height);
				ctx.textBaseline = 'top'; // Align text to the top
				ctx.textAlign = 'left'; // Align text by its starting point
				// Draw each text field
				template.textFields.forEach((field) => {
					const scaledX = Math.round(field.x * scaleX);
					const scaledY = Math.round(field.y * scaleY);
					const scaledFontSize = field.fontSize * Math.max(scaleX, scaleY);
					ctx.font = `${scaledFontSize}px Impact, Haettenschweiler, sans-serif`;
					ctx.lineWidth = 1 * Math.max(scaleX, scaleY);
					ctx.fillStyle = field.color;
					ctx.strokeStyle = field.strokeColor;
					ctx.fillText(field.text, scaledX, scaledY);
					ctx.strokeText(field.text, scaledX, scaledY);
				});

				template.imageFields.forEach((image) => {
					const newImg = new Image();
					newImg.src = image.image;
					const scaledX = Math.round(image.x * scaleX);
					const scaledY = Math.round(image.y * scaleY);
					const scaledWidth = Math.round( newImg.width * scaleX);
					const scaledHeight = Math.round(newImg.height* scaleY);
					ctx.drawImage(newImg, scaledX, scaledY, scaledWidth, scaledHeight)
				})

				resolve();
			};
		});

		// Convert the canvas to a downloadable image
	const link = document.createElement('a');
		link.download = fileName;
		link.href = canvas.toDataURL(selectedFileType.value);
		link.click();
	};
</script>

<div class="p-6">
	<h1 class="mb-6 text-center text-4xl font-bold">Meme Generator 3000</h1>

	<div class="flex flex-col items-top lg:flex-row">
		<!-- Meme preview -->
		<div class="mt-6 lg:ml-6 lg:mt-0 lg:w-3/5">
			<MemePreview/>
		</div>

		<!-- Form -->
		<div class="mt-6 lg:ml-6 lg:mt-0 lg:w-2/5">
			<h2 class="mb-4 text-xl font-semibold">Templates</h2>
			<div class="flex">
				<label
					class="cursor-pointer rounded-md border p-1 shadow ring-purple-500 transition hover:ring"
				>
					<input type="file" class="hidden" accept="image/*" onchange={handleFileUpload} />
					<div class="flex h-20 w-20 items-center justify-center rounded-md bg-gray-200">+</div>
				</label>
				{#each $templates as template, index}
					<button
						onclick={() => stagedTemplate.set(template)}
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



			<h2 class="mb-4 mt-6 text-xl font-semibold">Canvas Settings</h2>
			<div class="mb-4">
				<p>TODO</p>
				<!--TODO: #7 add bg colour picker and canvas dims-->
			</div>

			{#if $stagedTemplate}
				<h2 class="mb-4 mt-6 text-xl font-semibold">File Settings</h2>
				<h3>File Name</h3>
				<div class="mb-4">
					<input
						type="text"
						class="mb-2 w-full rounded-md border p-2"
						bind:value={fileName}
						placeholder="e.g. my-meme-file"
					/>
					</div>
				<h3>File Type</h3>
				<div class="mb-4">
					<select bind:value={selectedFileType} class="mb-2 w-full rounded-md border p-2">
						{#each fileTypeOptions as fileTypeOption}
						<option value={fileTypeOption}>
							{fileTypeOption.text}
						</option>
						{/each}
					</select>
				</div>

				<h2 class="mb-4 mt-6 text-xl font-semibold">Text Fields</h2>
				{#each $stagedTemplate.textFields as field, index}
				<h3>Text Field #{index + 1}</h3>
					<div class="mb-4">
						<input
							type="text"
							class="mb-2 w-full rounded-md border p-2"
							value={field.text}
							oninput={(e) => updateTextField(index, 'text', (e.target as HTMLInputElement).value)}
							placeholder="Enter text"
						/>
						<div class="flex space-x-2">
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								value={field.x}
								oninput={(e) => updateTextField(index, 'x', +(e.target as HTMLInputElement).value)}
								placeholder="X"
							/>
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								value={field.y}
								oninput={(e) => updateTextField(index, 'y', +(e.target as HTMLInputElement).value)}
								placeholder="Y"
							/>
							<input
								type="number"
								class="w-20 rounded-md border p-2"
								value={field.fontSize}
								oninput={(e) =>
									updateTextField(index, 'fontSize', +(e.target as HTMLInputElement).value)}
								placeholder="Font Size"
							/>
							<input
								type="color"
								class="w-10 h-auto rounded-md border p-1"
								value={field.color}
								oninput={(e) =>
									updateTextField(index, 'color', (e.target as HTMLInputElement).value)}
							/>
							<input
								type="color"
								class="w-10 h-auto rounded-md border p-1"
								value={field.strokeColor}
								oninput={(e) =>
									updateTextField(index, 'strokeColor', (e.target as HTMLInputElement).value)}
							/>
							<button
								class="rounded-md bg-red-500 px-3 text-white text-xl"
								onclick={() => removeTextField(index)}
							>
								&#10005;
							</button>
						</div>
					</div>
				{/each}

				<div class="flex flex-col lg:flex-row justify-between space-x-3">
					<button onclick={addTextField} class="mt-4 w-1/2 rounded-md bg-blue-500 px-4 py-2 text-white">
						Add text
					</button>
					<button  class="mt-4 w-1/2 rounded-md bg-teal-500 px-4 py-2 text-white">
						<input type="file"  accept="image/*" onchange={addImageField} />
						Add image (TODO)
						<!-- TODO: Currently the image upload input is just inside the button, the button should trigger a file upload -->
					</button>
				</div>

				<button
					onclick={downloadMeme}
					class="mt-4 block w-full rounded-md bg-purple-500 px-4 py-2 text-white"
				>
					Download Meme
				</button>

				<button
					onclick={saveTemplate}
					class="mt-4 block w-full rounded-md bg-green-500 px-4 py-2 text-white"
				>
					Save template
				</button>
			{/if}
		</div>
	</div>
</div>
