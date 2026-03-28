import GameDataInterface from "./gameDataInterface";
import TagDataInterface from "./tagDataInterface";

export default interface UserDataInterface {
    id: number;
    email: string;
    name: string;
    gamerTag: string;
    playStyle: string;
    bio: string;
    avatarUrl: string;
    preferences: string;
    createdAt: Date;
    games: GameDataInterface[];
    tags: TagDataInterface[];
}