﻿using Model.Enums;
namespace Model.Options
{
    public class TicketOption
    {

        public List<TicketTypeEnum> Types { get; set; }

        public List<SeverityEnum> Severities { get; set; }

        public bool? IsResolved { get; set; }
    }
}
