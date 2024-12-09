import type { MemeTextField } from '$lib/models/meme-text-field';

export interface MemeTemplate {
    image: string;
    width: number;
    height: number;
    textFields: MemeTextField[];
}