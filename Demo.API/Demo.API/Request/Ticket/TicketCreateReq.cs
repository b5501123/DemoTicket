using Model.Enums;

namespace Demo.API.Request
{
    public class TicketCreateReq
    {
        public TicketTypeEnum Type { get; set; }

        public SeverityEnum Severity { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }
    }
}
