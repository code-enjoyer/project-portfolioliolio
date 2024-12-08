export interface Template {
    image: string;
    textFields: {
        text: string;
        x: number;
        y: number;
        fontSize: number;
        color: string;
        strokeColor: string
    }[];
}