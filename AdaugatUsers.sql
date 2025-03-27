insert into Users(UserName,Password,Email,CreatedAt)
values ('Popescu Ioana','user234','popescu_ioana@gmail.com')

select* from Users

exec dbo.InsertUser 'Ionescu Diana','pass234','ionescuIoana@yahoo.com','2024-03-26 14:30:00'