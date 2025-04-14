using Microsoft.AspNetCore.Mvc;

namespace TrustPay.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
