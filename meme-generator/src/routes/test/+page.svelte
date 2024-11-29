<script lang="ts">
	import { onMount } from "svelte";
  
	let topText: string = "Top Text";
	let bottomText: string = "Bottom Text";
	let image: HTMLImageElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
  
	const handleImageUpload = (event: Event): void => {
	  const target = event.target as HTMLInputElement;
	  const file = target.files?.[0];
  
	  if (file) {
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
		  if (e.target?.result) {
			image = new Image();
			image.src = e.target.result.toString();
			image.onload = () => drawMeme();
		  }
		};
		reader.readAsDataURL(file);
	  }
	};
  
	const drawMeme = (): void => {
	  if (canvas && image) {
		ctx = canvas.getContext("2d");
  
		if (!ctx) return;

		// Set canvas size to match the image
		canvas.width = image.width;
		canvas.height = image.height;
  
		// Draw the image on the canvas
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
		// Meme text styling
		const fontSize = Math.floor(canvas.width / 10);
		ctx.font = `${fontSize}px Impact`;
		ctx.fillStyle = "white";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 5;
		ctx.textAlign = "center";
  
		// Draw top text
		ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize);
		ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize);
  
		// Draw bottom text
		ctx.fillText(
		  bottomText.toUpperCase(),
		  canvas.width / 2,
		  canvas.height - fontSize / 2
		);
		ctx.strokeText(
		  bottomText.toUpperCase(),
		  canvas.width / 2,
		  canvas.height - fontSize / 2
		);
	  }
	};
</script>
  
<style>
	main {
	  text-align: center;
	  font-family: Arial, sans-serif;
	  margin: 20px;
	}
  
	canvas {
	  border: 1px solid #ddd;
	  max-width: 100%;
	  height: auto;
	}
  
	input[type="file"],
	input[type="text"] {
	  margin: 10px;
	  padding: 5px;
	  font-size: 16px;
	}
  
	.controls {
	  margin-bottom: 20px;
	}
</style>
  
<main>
	<h1>Meme Generator</h1>
	<div class="controls">
	  <input
		type="file"
		accept="image/*"
		onchange={handleImageUpload}
	  />
	  <br />
	  <input
		type="text"
		placeholder="Top Text"
		bind:value={topText}
		onchange={drawMeme}
	  />
	  <br />
	  <input
		type="text"
		placeholder="Bottom Text"
		bind:value={bottomText}
		onchange={drawMeme}
	  />
	</div>
	<canvas bind:this={canvas}></canvas>
</main>
  