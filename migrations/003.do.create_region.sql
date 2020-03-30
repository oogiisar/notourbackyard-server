CREATE TABLE region (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    region_name TEXT NOT NULL,
    country INTEGER REFERENCES countries(id) NOT NULL 
);