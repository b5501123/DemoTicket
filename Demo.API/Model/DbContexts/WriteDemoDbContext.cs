using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Model.Models;

namespace Model.DbContexts
{
    public class WriteDemoDbContext : BaseDemoDbContext
    {
        public WriteDemoDbContext(DbContextOptions<WriteDemoDbContext> options)
           : base(options)
        {
        }
    }
}
