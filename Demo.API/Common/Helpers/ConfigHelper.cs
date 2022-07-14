using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Helpers
{
    public class ConfigHelper
    {

        public ConfigHelper(IConfiguration configuration)
        {
            WriteMqlConnectionString= configuration.GetConnectionString("WriteMySql");
            ReadMqlConnectionString = configuration.GetConnectionString("ReadMySql");

            SignKey = configuration.GetValue<string>("JwtSettings:SignKey");
            Issuer = configuration.GetValue<string>("JwtSettings:Issuer");
        }


        public static string WriteMqlConnectionString { get; set; }
        public static string ReadMqlConnectionString { get; set; }
        public static string SignKey { get; set; }
        public static string Issuer { get; set; }
    }
}
