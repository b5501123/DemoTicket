using Microsoft.EntityFrameworkCore;
using Model.DbContexts;
using Model.Models;
using Model.Options;
using Common.Options;
using Common.Extensions;
using Repository.Repositories.Interface;

namespace Repository.Repositories
{
    public class TicketRepository : BaseRepository, ITicketRepository
    {

        public TicketRepository(ReadDemoDbContext readDB, WriteDemoDbContext writeDB) : base(readDB, writeDB)
        {
        }

        public async Task<TicketModel> Get(int id)
        {
            return await _readDB.Ticket.FirstOrDefaultAsync(r => r.TicketID == id && !r.IsDel);
        }

        public async Task<List<TicketModel>> List(PaginationOption pagination, TicketOption option)
        {
            var query = _readDB.Ticket.AsQueryable().Where(r => !r.IsDel);

            if (option.Types.IsNotEmpty())
            {
                query = query.Where(r => option.Types.Contains(r.Type));
            }

            if (option.Severities.IsNotEmpty())
            {
                query = query.Where(r => option.Severities.Contains(r.Severity));
            }

            if (option.IsResolved != null)
            {
                query = query.Where(r => r.IsResolved == option.IsResolved);
            }

            pagination.Total = await query.CountAsync();

            return await query.DoPaging(pagination).ToListAsync();
        }

        public async Task<TicketModel> Create(TicketModel model)
        {
            model.CreateTime = DateTime.Now;
            model.IsDel = false;
            model.IsResolved = false;
            model.ResolvedTime = null;
            await _writeDB.Ticket.AddAsync(model);
            await _writeDB.SaveChangesAsync();

            return model;
        }

        public async Task<int> Update(TicketModel model)
        {
            return await _writeDB.Ticket.Where(r => r.TicketID == model.TicketID && !r.IsResolved && !r.IsDel).UpdateFromQueryAsync(r => new TicketModel
            {
                Summary = model.Summary,
                Severity = model.Severity,
                Description = model.Description,
            });
        }

        public async Task<int> Resolve(int tickedID)
        {
            return await _writeDB.Ticket.Where(r => r.TicketID == tickedID && !r.IsResolved).UpdateFromQueryAsync(r => new TicketModel
            {
                IsResolved = true,
                ResolvedTime = DateTime.Now,
            });
        }

        public async Task<int> Delete(int tickedID)
        {
            return await _writeDB.Ticket.Where(r => r.TicketID == tickedID && !r.IsDel).UpdateFromQueryAsync(r => new TicketModel
            {
                IsDel = true,
                ResolvedTime = DateTime.Now,
            });
        }
    }
}
