export interface ClanWarData {
    clan: {
        name: string;
        badgeUrls: {
            small: string;
        };
        attacks: number;
        stars: number;
        destructionPercentage: number;
    };
    opponent: {
        name: string;
        badgeUrls: {
            small: string;
        };
        attacks: number;
        stars: number;
        destructionPercentage: number;
    };
    attacksPerMember: number;
    teamSize: number;
}