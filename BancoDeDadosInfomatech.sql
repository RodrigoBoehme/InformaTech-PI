SELECT * FROM Usuario

CREATE TABLE Usuario (
    ID_Usuario INTEGER PRIMARY KEY,
    CPF VARCHAR(11),
    Email VARCHAR(255),
    NomeCompleto VARCHAR(255),
    Telefone VARCHAR(11),
    Endereco VARCHAR(255),
    CEP VARCHAR(255),
    Numero INTEGER,
    Bairro VARCHAR(255),
    Rua VARCHAR(255),
    Cidade VARCHAR(255),
    Complemento VARCHAR(255)
);

CREATE TABLE Enchente (
    DataInicio DATE,
    ID_Enchente INTEGER PRIMARY KEY,
    Nome VARCHAR(255),
    DataFim DATE
);

CREATE TABLE posicaoAtual (
    Latitude NUMERIC,
    Longitude VARCHAR(255),
    ultimoUpdate VARCHAR(255)
);

CREATE TABLE AreaDeRisco (
    id_AreaDeRisco INTEGER PRIMARY KEY,
    Codernadas VARCHAR(255),
    Descricao VARCHAR(255),
    GrauDeRisco VARCHAR(255)
);

CREATE TABLE Alagado (
    fk_Enchente_ID_Enchente INTEGER
);

CREATE TABLE Distancia (
    fk_AreaDeRisco_id_AreaDeRisco INTEGER
);
 
ALTER TABLE Alagado ADD CONSTRAINT FK_Alagado__1
    FOREIGN KEY (fk_Enchente_ID_Enchente)
    REFERENCES Enchente (ID_Enchente)
    ON DELETE SET NULL;
 
ALTER TABLE Distancia ADD CONSTRAINT FK_Distancia_1
    FOREIGN KEY (fk_AreaDeRisco_id_AreaDeRisco)
    REFERENCES AreaDeRisco (id_AreaDeRisco)
    ON DELETE SET NULL;