export default interface GameDataInterface{
    id: number;
    name: string;
    genres: { id: number; name: string }[];
}