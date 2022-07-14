using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Model.Models;

namespace Model.DbContexts
{
    public abstract class BaseDemoDbContext: DbContext
    {
        public BaseDemoDbContext(DbContextOptions options)
           : base(options)
        {
        }
        public DbSet<UserModel> User { get; set; }

        public DbSet<TicketModel> Ticket { get; set; }
    }
}
