using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrustPay.Data;
using TrustPay.DTO;
using TrustPay.Models;

namespace TrustPay.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly DbTrustPayContext _context;

        public TransactionsController(DbTrustPayContext context)
        {
            _context = context;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        [HttpPost("addFunds", Name = "AddFundsToAccount")]
        public async Task<IActionResult> AddFunds([FromBody] Transaction transaction)
        {
            try
            {
                var fromAccount = await _context.Accounts.FindAsync(transaction.FromAccountId);
                var toAccount = await _context.Accounts.FindAsync(transaction.ToAccountId);

                if (fromAccount == null || toAccount == null)
                    return BadRequest("Account not found.");

                toAccount.Balance += transaction.Amount;

                transaction.TransactionDate = DateTime.UtcNow;
                transaction.TransactionType = "Deposit";

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return Ok("Funds added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding funds: {ex.Message}");
            }
        }

        [HttpPost("transfer", Name = "TransferFunds")]
        public async Task<IActionResult> TransferFunds([FromBody] TransferRequest request)
        {
            var fromAccount = await _context.Accounts.FindAsync(request.FromAccountId);
            var toAccount = await _context.Accounts.FindAsync(request.ToAccountId);

            if (fromAccount == null || toAccount == null)
                return NotFound("Unul sau ambele conturi nu au fost găsite.");

            if (request.Currency != fromAccount.Currency || request.Currency != toAccount.Currency)
                return BadRequest("Valuta trebuie să fie aceeași pentru ambele conturi.");

            if (fromAccount.Balance < request.Amount)
                return BadRequest("Fonduri insuficiente în contul sursă.");

            // Realizăm transferul
            fromAccount.Balance -= request.Amount;
            toAccount.Balance += request.Amount;

            // Salvăm tranzacția
            var transaction = new Transaction
            {
                FromAccountId = request.FromAccountId,
                ToAccountId = request.ToAccountId,
                Amount = request.Amount,
                Currency = request.Currency,
                TransactionDate = DateTime.UtcNow,
                TransactionType = "Transfer"
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Transfer realizat cu succes." });
        }





        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.TransactionId)
            {
                return BadRequest();
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Transactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.TransactionId }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetTransactionsByAccount(int accountId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.FromAccountId == accountId || t.ToAccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return Ok(transactions);
        }
        [HttpGet("history/{accountId}")]
        public async Task<IActionResult> GetTransactionHistoryByAccount(int accountId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.FromAccountId == accountId || t.ToAccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new
                {
                    Message = t.FromAccountId == accountId
                        ? $"🡒 Către contul {t.ToAccountId} — {t.Amount} {t.Currency} ({t.TransactionDate.ToString("dd.MM.yyyy, HH:mm")})"
                        : $"🡐 De la contul {t.FromAccountId} — {t.Amount} {t.Currency} ({t.TransactionDate.ToString("dd.MM.yyyy, HH:mm")})"
                })
                .ToListAsync();

            return Ok(transactions);
        }

    }

}