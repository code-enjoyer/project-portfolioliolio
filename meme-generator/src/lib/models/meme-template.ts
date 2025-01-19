import type { MemeTextField } from '$lib/models/meme-text-field';
import type { MemeImageField } from './meme-image-field';

export interface MemeTemplate {
    image: string;
    width: number;
    height: number;
    textFields: MemeTextField[];
    imageFields: MemeImageField[]
}