<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let backgroundColor = '#ffffff';
    let backgroundImageSrc = '';
    let selectedComponent: ComponentBase | null = null;
    let isDragging: boolean = false;

    interface ComponentBase {
        type: string;
        x: number;
        y: number;
        width: number;
        height: number;
        isDragging: boolean;
    }

    interface TextComponent extends ComponentBase {
        type: 'text';
        content: string;
    }

    let components: Array<ComponentBase> = [];

    onMount(() => {
        ctx = canvas.getContext('2d');
        drawCanvas();
    });

    function setBackground(colour: string) {
        backgroundColor = colour;
        drawCanvas();
    }

    function setBackgroundImage(src: string) {
        backgroundImageSrc = src;
        drawCanvas();
    }

    function addTextComponent() {
        components.push({
            type: 'text',
            content: 'Edit me',
            x: 50,
            y: 50,
            width: 100,
            height: 30,
            isDragging: false
        } as TextComponent);
        drawCanvas();
    }

    function drawCanvas() {
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (backgroundImageSrc) {
            const img = new Image();
            img.src = backgroundImageSrc;
            img.onload = () => {
                if (!ctx) return;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawComponents();
            };
        } else {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function drawComponents() {
        components.forEach((component) => {
            if (!ctx) return;

            if (component.type === 'text') {
                const textComponent = component as TextComponent;

                ctx.fillStyle = '#000';
                ctx.fillText(textComponent.content, component.x, component.y);
            }

            // Handle other component types
        });
    }

    function handleMouseDown(event: MouseEvent) {
        const { offsetX, offsetY } = event;

        selectedComponent = components.find(
            (comp) =>
                offsetX >= comp.x &&
                offsetX <= comp.x + comp.width &&
                offsetY >= comp.y &&
                offsetY <= comp.y + comp.height
        ) ?? null;

        if (selectedComponent) {
            isDragging = true;
            selectedComponent.isDragging = true;
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (isDragging && selectedComponent) {
            const { offsetX, offsetY } = event;

            selectedComponent.x = offsetX - selectedComponent.width / 2;
            selectedComponent.y = offsetY - selectedComponent.height / 2;

            drawCanvas();
        }
    }

    function handleMouseUp() {
        isDragging = false;
        
        if (selectedComponent) {
            selectedComponent.isDragging = false;
            selectedComponent = null;
        }
    }
</script>

<div class="controls">
    <input type="color" bind:value={backgroundColor} on:change={() => setBackground(backgroundColor)} />
    <input type="text" placeholder="Background Image URL" bind:value={backgroundImageSrc} on:input={drawCanvas} />
    <button on:click={addTextComponent}>Add Text</button>
</div>

<canvas
    bind:this={canvas}
    width="800"
    height="600"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
></canvas>

<style>
    .controls {
        margin-bottom: 10px;
    }
    canvas {
        border: 1px solid #ccc;
    }
</style>