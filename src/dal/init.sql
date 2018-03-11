

CREATE TABLE public.user_ratings
(
    user_id text not null,
    rating_id text NOT NULL,
    album_name text not null,
    artist text not null,
    rating SMALLINT not null,
    create_date timestamp not null, 
    comments text,
    fave_songs jsonb,
    CONSTRAINT ratings_pkey PRIMARY KEY (user_id, rating_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_ratings
    OWNER to postgres;

