using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Model.Claims;
using Model.Enums;

namespace Model.Info
{
    public class UserInfo
    {
        private readonly List<Claim> claims;
        public UserInfo(IHttpContextAccessor httpContextAccessor)
        {
            claims = httpContextAccessor?.HttpContext?.User?.Claims.ToList();
        }

        public int UserID
        {
            get
            {
                var id = claims.FirstOrDefault(r => r.Type == UserClaims.UserID)?.Value;
                if (id != null)
                {
                    var num = 0;
                    int.TryParse(id, out num);
                    return num;
                }
                return 0;
            }
        }


        public string? Account
        {
            get
            {
                var name = claims.FirstOrDefault(r => r.Type == UserClaims.Account)?.Value;
                return name;
            }
        }


        public string? Name
        {
            get
            {
                var name = claims.FirstOrDefault(r => r.Type == UserClaims.Name)?.Value;
                return name;
            }
        }

        public RoleEnum? Role
        {
            get
            {
                var id = claims.FirstOrDefault(r => r.Type == UserClaims.Role)?.Value;
                if (id != null)
                {
                    RoleEnum role;
                    return Enum.TryParse(id, out role) ? role : null;
                }

                return null;
            }
        }
    }
}
