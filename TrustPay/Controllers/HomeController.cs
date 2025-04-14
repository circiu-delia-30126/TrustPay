using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrustPay.Data;
using TrustPay.Models;
using TrustPay.Models.Domain;

namespace TrustPay.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly DbTrustPayContext _context;

    public HomeController(ILogger<HomeController> logger, DbTrustPayContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
    public async Task<IActionResult> Create(string userName, string password, string email, DateTime createAt)
    {
        await _context.InsertUser(userName, password , email, createAt);
        return RedirectToAction(nameof(Index));
    }
}
