using Model.Enums;

namespace Demo.API.Request
{
    public class TicketUpdateReq
    {
        public int TicketID { get; set; }
        public SeverityEnum Severity { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }
    }
}
