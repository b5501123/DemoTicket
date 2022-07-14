using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.DbContexts;

namespace Repository.Repositories
{
    public abstract class BaseRepository
    {
        protected ReadDemoDbContext _readDB { get; }

        protected WriteDemoDbContext _writeDB { get; }

        public BaseRepository(ReadDemoDbContext readDB,WriteDemoDbContext writeDB)
        {
            _readDB = readDB;
            _writeDB = writeDB;
        }
    }
}
