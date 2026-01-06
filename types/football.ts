export interface Team {
    id: number;
    name: string;
    logo: string;
    goals?: number;
    colors?: {
        player: { primary: string; number: string; border: string };
        goalkeeper: { primary: string; number: string; border: string };
    };
}

export interface Venue {
    name: string;
    city: string;
}

export interface League {
    id: number;
    name: string;
    round: string;
    logo: string;
}

export interface MatchStatus {
    long: string;
    short: string;
}

export interface MatchScore {
    home: number;
    away: number;
    display: string;
    halftime: {
        home: number;
        away: number;
    };
}

// --- Advanced Details ---

export interface MatchEvent {
    time: { elapsed: number; extra: number | null };
    team: { id: number; name: string; logo: string };
    player: { id: number; name: string };
    assist: { id: number | null; name: string | null };
    type: 'Goal' | 'Card' | 'subst' | 'Var';
    detail: string;
    comments: string | null;
}

export interface Player {
    id: number;
    name: string;
    number: number;
    pos: string; // G, D, M, F
    grid?: string; // "row:col"
}

export interface Lineup {
    team: {
        id: number;
        name: string;
        logo: string;
        colors: any;
    };
    formation: string;
    coach: {
        id: number;
        name: string;
        photo: string;
    };
    startXI: Player[];
    substitutes: Player[];
}

export interface TeamStatistics {
    team: { id: number; name: string; logo: string };
    statistics: Record<string, number | string>;
}

export interface Match {
    id: number;
    date: string;
    venue: Venue;
    league: League;
    home: Team;
    away: Team;
    status?: MatchStatus; // For fixtures
    score?: MatchScore;   // For results
    arsenal?: {
        is_home: boolean;
        opponent: string;
        opponent_logo: string;
        venue_type: 'H' | 'A';
        goals_for?: number;
        goals_against?: number;
        result?: 'W' | 'D' | 'L';
    };
    // Optional details populated in report
    events?: MatchEvent[];
    lineups?: Lineup[];
    statistics?: TeamStatistics[];
}

export interface LeagueStanding {
    rank: number;
    team: Team;
    points: number;
    goals_diff: number;
    form: string;
    stats: {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goals_for: number;
        goals_against: number;
    };
}

export interface Competition {
    id: number;
    name: string;
    type: string;
    logo: string;
    country: {
        name: string;
        code: string | null;
        flag: string | null;
    };
    season: {
        year: number;
        start: string;
        end: string;
    };
    match_count: number;
}

// API Response Wrappers
export interface MatchResponse {
    data: Match;
}

// Wrapper for the new report endpoint
export interface MatchReportResponse {
    data: {
        match: Match;
        events: MatchEvent[];
        lineups: Lineup[];
        statistics: TeamStatistics[];
    };
}

export interface LeagueStandingsResponse {
    data: LeagueStanding[];
    meta: {
        season: number;
        league_id: number;
        league_name: string;
    };
}

export interface CompetitionsResponse {
    data: Competition[];
    meta: {
        total: number;
        season: number;
    };
}

export interface StandingTeam {
    rank: number;
    team: {
        id: number;
        name: string;
        logo: string;
    };
    points: number;
    goals_diff: number;
    form: string;
    description: string | null;
    stats: {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goals_for: number;
        goals_against: number;
    };
    home: {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goals_for: number;
        goals_against: number;
    };
    away: {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goals_for: number;
        goals_against: number;
    };
}

export interface CompetitionStanding {
    competition: Competition;
    team_position: StandingTeam | null;
    standings?: StandingTeam[];
    groups?: {
        name: string;
        standings: StandingTeam[];
    }[];
}

export interface AllStandingsResponse {
    data: CompetitionStanding[];
    meta: {
        total_competitions: number;
        season: number;
    };
}

export interface Season {
    year: number;
    label: string;
    competitions_count: number;
    matches_count: number;
    is_current: boolean;
}

export interface SeasonsResponse {
    data: Season[];
    meta: {
        total: number;
        current_season: number;
    };
}
