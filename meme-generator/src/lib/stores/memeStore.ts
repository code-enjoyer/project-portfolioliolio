import type { MemeTemplate } from '$lib/models/meme-template';
import { writable } from 'svelte/store';

export const templates = writable<MemeTemplate[]>([]);
export const stagedTemplate = writable<MemeTemplate | null>(null);