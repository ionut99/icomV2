CREATE TABLE iusers (
  userId INT NOT NULL  IDENTITY(1, 1),
  Surname varchar(255) NOT NULL,
  Name varchar(255) NOT NULL,
  Email varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  IsAdmin TINYINT NOT NULL, 
  PRIMARY KEY (userId)
)

select*from iusers