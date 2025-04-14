using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using TrustPay.Data;
using TrustPay.Models.Domain;

namespace TrustPay.Controllers
{
    public class AccountController : Controller
    {
        private readonly DbTrustPayContext _dbContext;

        public AccountController(DbTrustPayContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        //public IActionResult Index()
        //{
        //    return View();
        //}

        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddAccountsViewModel addAccountsViewModel)
        {
            Account newAccount = new Account()
            {
                AccountId = Convert.ToInt32(Guid.NewGuid()),
                UserId = addAccountsViewModel.UserId,
                Balance=addAccountsViewModel.Balance,
                Currency=addAccountsViewModel.Currency,
                AccountType=addAccountsViewModel.AccountType
            };
            await _dbContext.Accounts.AddAsync(newAccount);
            await _dbContext.SaveChangesAsync();
            return View("Add");
        }
    }
}
