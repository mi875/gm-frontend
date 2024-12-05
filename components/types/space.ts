export interface SpaceData {
    id: string;
    nameName: string;
    timeOfBorn: string;
    members: { email: string, admin: boolean }[];
}