create database db_TrustPay
go
use db_TrustPay
go
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) PRIMARY KEY,
	[UserName] [nvarchar](40) UNIQUE NOT NULL,
	[Password] [varchar](40) NOT NULL,
	[Email] [varchar](60) NOT NULL,
	[CreatedAt] [datetime] NOT NULL )
GO
CREATE TABLE [dbo].[Accounts](
	[AccountID] [int] IDENTITY(1,1) PRIMARY KEY,
	[UserID] [int] FOREIGN KEY REFERENCES Users(UserID),
	[Balance] [money] NOT NULL,
	[Currency] [varchar](15) NOT NULL,
	[AccountType] [varchar](40) NOT NULL,
	[CreatedAt] [datetime] NOT NULL 
	)
GO	
CREATE TABLE [dbo].[Transactions](
	[TransactionID] [int] IDENTITY(1,1) PRIMARY KEY,
	[FromAccountID] [int] FOREIGN KEY REFERENCES Accounts(AccountID),
	[ToAccountID] [int] FOREIGN KEY REFERENCES Accounts(AccountID),
	[Amount] [money] NOT NULL,
	[Currency] [varchar](15) NOT NULL,
	[TransactionDate] [datetime] NOT NULL,
	[TransactionType] [varchar](30) NOT NULL
	)
GO