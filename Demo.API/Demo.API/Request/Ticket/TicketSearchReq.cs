using Common.Enums;
using Common.Options;
using Model.Options;
using Common.Extensions;
using Model.Enums;

namespace Demo.API.Request
{
    public class TicketSearchReq : SearchBaseReq
    {
        public string? Types { get; set; }

        public string? Severities { get; set; }

        public bool? IsResolved { get; set; }

        public TicketOption BuildTicketOption()
        {
            return new TicketOption
            {
                Types = this.Types.ToListByCutString<TicketTypeEnum>(),
                Severities = this.Severities.ToListByCutString<SeverityEnum>(),
                IsResolved = this.IsResolved,
            };
        }
    }
}
