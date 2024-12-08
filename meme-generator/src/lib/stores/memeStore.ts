import type { Template } from '$lib/models/template';
import { writable } from 'svelte/store';

export const templates = writable<Template[]>([]);
export const stagedTemplate = writable<Template | null>(null);