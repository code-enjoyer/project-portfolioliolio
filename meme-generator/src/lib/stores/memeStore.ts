import { writable } from 'svelte/store';
import "$lib/components/template";

export const templates = writable<Template[]>([]);
export const stagedTemplate = writable<Template | null>(null);