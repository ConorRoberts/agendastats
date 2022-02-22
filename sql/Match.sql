create table if not exists MATCH(
    match_id VARCHAR(100) NOT NULL,
    match_type VARCHAR(25) NOT NULL,

    primary key (match_id)
);