CREATE TABLE cleanups (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    location INTEGER REFERENCES region(id) NOT NULL,
    user_name INTEGER REFERENCES users(id) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT now(),
    type_of_trash garbage_type NOT NULL,
    quantity INTEGER NOT NULL
);