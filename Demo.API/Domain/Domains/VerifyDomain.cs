using Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Domains
{
    public class VerifyDomain
    {

        public static bool VerifyTicket(TicketTypeEnum type, RoleEnum role, ActionEnum action)
        {
            if (type == TicketTypeEnum.Bug && role != RoleEnum.QA && (action == ActionEnum.Update || action == ActionEnum.Create || action == ActionEnum.Delete))
            {
                return false;
            }

            if (type == TicketTypeEnum.Bug && role != RoleEnum.RD && action == ActionEnum.Resolve)
            {
                return false;
            }

            if (type == TicketTypeEnum.TestCase && role != RoleEnum.QA && (action == ActionEnum.Resolve || action == ActionEnum.Create))
            {
                return false;
            }

            if (type == TicketTypeEnum.FeatureRequest && role != RoleEnum.RD && action == ActionEnum.Resolve)
            {
                return false;
            }

            if (type == TicketTypeEnum.FeatureRequest && role != RoleEnum.PM && action == ActionEnum.Create)
            {
                return false;
            }

            return true;
        }
    }
}
