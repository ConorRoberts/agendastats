CREATE TABLE IF NOT EXISTS STATS (
    match_id VARCHAR(100) NOT NULL,
    match_type VARCHAR(25) NOT NULL,

    player_name VARCHAR(25) NOT NULL,
    player_agency VARCHAR(25),
    player_class VARCHAR(10) NOT NULL,

    kills INTEGER NOT NULL,
    bot_kills INTEGER NOT NULL,
    damage INTEGER NOT NULL,
    absorbed INTEGER NOT NULL,

    deaths INTEGER NOT NULL,

    healing INTEGER NOT NULL,
    assists INTEGER NOT NULL,
    buffs INTEGER NOT NULL,
    
    obj_pts INTEGER NOT NULL,
    defense INTEGER NOT NULL,

    timestamp DATE NOT NULL,

    PRIMARY KEY (player_name, match_id)
);