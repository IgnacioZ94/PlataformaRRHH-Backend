USE employeems

/**Inicio de creacion de tablas**/
CREATE TABLE admin (
    id INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE category (
    id INT PRIMARY KEY IDENTITY(1,1), 
    name VARCHAR(255) NOT NULL,
);

CREATE TABLE employee (  
    id INT PRIMARY KEY,  
    name VARCHAR(255) NOT NULL,  
    email VARCHAR(255) NOT NULL,  
    password VARCHAR(255) NOT NULL,  
    address VARCHAR(255) NOT NULL,  
    salary DECIMAL(10,2) NOT NULL,  
    image VARCHAR(255) NULL,  
    category_id INT NOT NULL,  
    FOREIGN KEY (category_id) REFERENCES category(id) 
); 
/**Finalizacion de creacion de tablas**/

/**Inicio del alta de usuarios administrativos**/

/**Finalizacion del alta de usuarios administrativos**/