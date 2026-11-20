CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
)

ALTER TABLE movies ADD episode INT;
ALTER TABLE movies ADD profileId INT;

ALTER TABLE movies ADD CONSTRAINT haahaa FOREIGN KEY (profileId) REFERENCES profiles(id);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    displayName VARCHAR(255) NOT NULL
)
