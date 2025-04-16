using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrustPay_CRUD
{
    class Program
    {
        static void Main(string[] args)
        {

          //  CreateUser();
            ReadUsers();
            //UpdateUser();
             //DeleteUser();

            CreateAccount();
            //ReadAccounts();

            CreateTransaction();
            ReadTransactions();


            Console.ReadLine();
        }

        static void CreateUser()
        {
            var context = new db_TrustPay1Entities();

            var newUser = new User()
            {
                UserName = "adina_b",
                Password = "parola123",
                Email = "adina@example.com",
                CreatedAt = DateTime.Now
            };
            var newUser1 = new User()
            {
                UserName = "marius",
                Password = "parola",
                Email = "marius@example.com",
                CreatedAt = DateTime.Now
            };

            //.Users.Add(newUser);
            context.Users.Add(newUser1);
            context.SaveChanges();
        }

        static void ReadUsers()
        {
            var context = new db_TrustPay1Entities();

            var users = context.Users.ToList();

            foreach (var user in users)
            {
                Console.WriteLine($"ID: {user.UserID}, Username: {user.UserName}, Email: {user.Email}, Created At: {user.CreatedAt}");
            }
        }

        static void UpdateUser()
        {
            var context = new db_TrustPay1Entities();

            var user = context.Users.FirstOrDefault(u => u.UserName == "adina_b");

            if (user != null)
            {
                user.Email = "noul_email@example.com";
                context.SaveChanges();
            }
        }

        static void DeleteUser()
        {
            var context = new db_TrustPay1Entities();

            var user = context.Users.FirstOrDefault(u => u.UserName == "circiu_a");

            if (user != null)
            {
                context.Users.Remove(user);
                context.SaveChanges();
            }
        }

        static void CreateAccount()
        {
            var context = new db_TrustPay1Entities();

            var newAccount = new Account()
            {
                UserID = 1,             
                Balance = 1500.00m,
                Currency = "RON",
                AccountType = "Savings", 
                CreatedAt = DateTime.Now
            };

            context.Accounts.Add(newAccount);
            context.SaveChanges();
        }

        static void ReadAccounts()
        {
            var context = new db_TrustPay1Entities();

            var accounts = context.Accounts.ToList();

            foreach (var acc in accounts)
            {
                Console.WriteLine($"ID: {acc.AccountID}, UserID: {acc.UserID}, Balance: {acc.Balance}, Currency: {acc.Currency}");
            }
        }

        static void UpdateAccount()
        {
            var context = new db_TrustPay1Entities();

            var account = context.Accounts.FirstOrDefault(a => a.AccountID == 1); // sau orice ID ai

            if (account != null)
            {
                account.Balance += 500; // ex: adaugă bani
                context.SaveChanges();
            }
        }

        static void DeleteAccount()
        {
            var context = new db_TrustPay1Entities();

            var account = context.Accounts.FirstOrDefault(a => a.AccountID == 1);

            if (account != null)
            {
                context.Accounts.Remove(account);
                context.SaveChanges();
            }
        }

        static void CreateTransaction()
        {
            var context = new db_TrustPay1Entities();

            var newTransaction = new Transaction()
            {
                FromAccountID = 1,     
                ToAccountID = 2,
                Amount = 250.00m,
                Currency = "RON",
                TransactionDate = DateTime.Now,
                TransactionType = "Transfer"
            };

            context.Transactions.Add(newTransaction);
            context.SaveChanges();
        }

        static void ReadTransactions()
        {
            var context = new db_TrustPay1Entities();

            var transactions = context.Transactions.ToList();

            foreach (var t in transactions)
            {
                Console.WriteLine($"ID: {t.TransactionID}, From: {t.FromAccountID}, To: {t.ToAccountID}, Amount: {t.Amount} {t.Currency}, Date: {t.TransactionDate}, Type: {t.TransactionType}");
            }
        }

        static void UpdateTransaction()
        {
            var context = new db_TrustPay1Entities();

            var transaction = context.Transactions.FirstOrDefault(t => t.TransactionID == 1); // sau orice ID existent

            if (transaction != null)
            {
                transaction.Amount = 500.00m;
                transaction.TransactionType = "Actualizat";
                context.SaveChanges();
            }
        }

        static void DeleteTransaction()
        {
            var context = new db_TrustPay1Entities();

            var transaction = context.Transactions.FirstOrDefault(t => t.TransactionID == 1); // sau alt ID

            if (transaction != null)
            {
                context.Transactions.Remove(transaction);
                context.SaveChanges();
            }
        }
    }
}




