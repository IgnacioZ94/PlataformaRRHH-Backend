/**Creacion de Base de Datos**/
CREATE DATABASE employeems;

/**Inicio de creacion de tablas**/
USE employeems
CREATE TABLE admin (
    id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE category (
    id INT PRIMARY KEY IDENTITY(1,1), 
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE employee (  
    id INT PRIMARY KEY IDENTITY(1,1), 
    name VARCHAR(255) NOT NULL,  
    email VARCHAR(255) NOT NULL,  
    password VARCHAR(255) NOT NULL,  
    address VARCHAR(255) NOT NULL,  
    salary DECIMAL(10,2) NOT NULL,  
    image VARCHAR(255) NULL,  
    category_id INT NOT NULL
); 
/**Finalizacion de creacion de tablas**/

/**Inicio del alta de usuarios administrativos**/
INSERT INTO [employeems].[dbo].[admin] ([email], [password])  
VALUES  ('admin@gmail.com', '123'),  ('gerente@gmail.com', '123');
/**Finalizacion del alta de usuarios administrativos**/