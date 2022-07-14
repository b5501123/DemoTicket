using Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<UserModel> Get(string account);

        Task<UserModel> Get(int userID);

        Task<bool> CheckAccount(string account);

        Task<UserModel> Create(UserModel user);
    }
}
