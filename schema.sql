create table usuario (
    id integer not null IDENTITY,
    email varchar(255) not null,
    senha varchar(2555) not null,
    constraint pk_usuario primary key (id)
)