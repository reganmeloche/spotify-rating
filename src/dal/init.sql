CREATE TABLE public.users
(
    user_id text not null,
    profile_id text NOT NULL,
    email text not null,
    join_date timestamp with time zone not null, 
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

--------------------------------

CREATE TABLE public.user_ratings
(
    user_id text not null references users(user_id) ON DELETE CASCADE,
    rating_id text NOT NULL,
    album_name text not null,
    artist text not null,
    rating SMALLINT not null,
    listen_date timestamp with time zone not null,
    create_date timestamp with time zone not null, 
    comments text,
    fave_songs text[],
    CONSTRAINT ratings_pkey PRIMARY KEY (user_id, rating_id)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_ratings
    OWNER to postgres;

---------------------------------

CREATE TABLE public.tokens
(
    user_id text not null references users(user_id) ON DELETE CASCADE,
    access_token text NOT NULL,
    access_token_expiry timestamp with time zone not null,
    refresh_token text not null,
    refresh_token_expiry timestamp with time zone not null,
    CONSTRAINT tokens_pkey PRIMARY KEY (user_id)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tokens
    OWNER to postgres;





