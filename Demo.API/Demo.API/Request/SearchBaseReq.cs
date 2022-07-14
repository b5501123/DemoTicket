using Common.Enums;
using Common.Options;

namespace Demo.API.Request
{
    public class SearchBaseReq
    {
        public int? Page { get; set; }

        public int? PageSize { get; set; }

        public string? SortBy { get; set; }

        public SortDirectionEnum Order { get; set; }

        public PaginationOption BuildOption()
        {
            return new PaginationOption
            {
                Page = Page ?? 1,
                PageSize = PageSize ?? 10,
                SortBy = SortBy,
                Order = Order,
            };
        }
    }
}
