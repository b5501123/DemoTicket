using Microsoft.EntityFrameworkCore;
using Model.DbContexts;
using Model.Models;
using Repository.Repositories.Interface;

namespace Repository.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {

        public UserRepository(ReadDemoDbContext readDB, WriteDemoDbContext writeDB) : base(readDB, writeDB)
        {
        }

        public async Task<UserModel> Get(string account)
        {
            return await _readDB.User.FirstOrDefaultAsync(r => r.Account == account);
        }

        public async Task<UserModel> Get(int userID)
        {
            return await _readDB.User.FirstOrDefaultAsync(r => r.UserID == userID);
        }

        public async Task<bool> CheckAccount(string account)
        {
            return !(await _readDB.User.AnyAsync(r => r.Account == account));
        }

        public async Task<UserModel> Create(UserModel user)
        {
            await _writeDB.User.AddAsync(user);
            await _writeDB.SaveChangesAsync();

            return user;
        }
    }
}
