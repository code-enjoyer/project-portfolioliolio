import type { MemeTextField } from '$lib/models/meme-text-field';

export interface MemeTemplate {
    image: string;
    textFields: MemeTextField[];
}