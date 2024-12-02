<script lang="ts">
    import { validateImageFile } from "../utils/fileUtils";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
  
    // Props
    export let onImageUpload: (file: File) => void;
  
    // Local state
    let dragOver = false;
  
    // Handlers
    const handleFileSelect = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input?.files?.[0]) {
        if (!validateImageFile(input.files[0])) {
            alert("Invalid file type! Please upload a JPEG, PNG, or GIF.");
            return;
        }
        onImageUpload(input.files[0]);
      }
    };
  
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      dragOver = false;
      if (event.dataTransfer?.files?.[0]) {
        if (!validateImageFile(event.dataTransfer.files[0])) {
            alert("Invalid file type! Please upload a JPEG, PNG, or GIF.");
            return;
        }
        onImageUpload(event.dataTransfer.files[0]);
      }
    };
  
    const preventDefaults = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
  </script>
  
  <div
  class={`flex flex-col items-center justify-center h-48 border-dashed border-4 p-6 rounded-md ${
    dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
  } transition-all`}
  on:dragover={preventDefaults}
  on:dragenter={() => (dragOver = true)}
  on:dragleave={() => (dragOver = false)}
  on:drop={handleDrop}
>
  <p class="text-center text-gray-500">
    Drag and drop an image here, or{" "}
    <label
      class="text-blue-500 underline cursor-pointer"
      for="file-input"
    >
      browse
    </label>
  </p>
  <input
    id="file-input"
    type="file"
    accept="image/*"
    class="hidden"
    on:change={handleFileSelect}
  />
</div>
  
  <style>
    .dragging {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  </style>
  