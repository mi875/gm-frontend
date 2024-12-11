export interface SpaceData {
    id: string;
    name: string;
    timeOfBorn?: string;
    members?: { email: string, admin: boolean }[];
}