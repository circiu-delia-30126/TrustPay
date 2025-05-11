namespace TrustPay.DTO
{
    public class TransferRequest
    {

        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = null!;
    }
}
