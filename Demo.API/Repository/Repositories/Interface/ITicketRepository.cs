using Common.Options;
using Model.Models;
using Model.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories.Interface
{
    public interface ITicketRepository
    {
        Task<TicketModel> Get(int id);

        Task<List<TicketModel>> List(PaginationOption pagination, TicketOption option);

        Task<TicketModel> Create(TicketModel model);

        Task<int> Update(TicketModel model);

        Task<int> Resolve(int tickedID);

        Task<int> Delete(int tickedID);
    }
}
