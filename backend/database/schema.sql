-- creation de la base de donnée
-- create DATABASE bibliotheque;

--creation des tables
create table Auteurs (
    id_auteur SERIAL PRIMARY KEY,
    nom varchar (150) NOT NULL,
    nationalite varchar (100)
);

create table Livres(
    id_livre SERIAL PRIMARY KEY,
    id_auteur INTEGER NOT NULL,
    titre varchar(150) NOT NULL,
    date_publication INTEGER,
    statut varchar(20) NOT NULL Default 'Disponible',

    CONSTRAINT fk_livre_auteur 
    foreign key (id_auteur) 
    references auteurs(id_auteur) 
    ON DELETE CASCADE,

    CONSTRAINT check_statut CHECK (statut IN ('disponible', 'emprunte'));
);

create table adherents(
    id_adherent SERIAL PRIMARY KEY,
    nom_adherent varchar(150) NOT NULL,
    contact varchar(100) NOT NULL
);

create table emprunts(
    id_emprunt SERIAL PRIMARY KEY,
    id_livre INTEGER NOT NULL,
    id_adherent INTEGER NOT NULL,
    date_emprunt DATE NOT NULL Default CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_reelle DATE,    
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'rendu', 'retard'));

    CONSTRAINT fk_emprunt_livre 
    foreign key (id_livre)
    references livres(id_livre) 
    on DELETE  CASCADE,
    
    CONSTRAINT fk_emprunt_adherent 
    foreign key (id_adherent) 
    references adherents(id_adherent)
    on DELETE CASCADE
);