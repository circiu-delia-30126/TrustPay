create procedure InsertUser(@userName nvarchar(40),
							@password varchar(40),
							@email varchar(60),
							@date datetime)
as 
if not exists( select *from Users where UserName=@userName )
begin 
insert Users(UserName) values(@userName)
end
if  exists(select * 
			  from Users
			  where UserName=@userName and Password=@password)

begin
print 'This user already exists.'
end
else
begin
INSERT [Users] ([UserName],[Password],[Email],[CreatedAt])
values(@userName,@password,@email,@date)
end