using Common.Enums;
namespace Common.Options
{
    public class PaginationOption
    {

        /// <summary>
        /// 目前頁數。(從1開始)
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// 每頁幾筆資料，預設為10。
        /// </summary>
        public int PageSize { get; set; } = 10;

        /// <summary>
        /// 總共資料數。
        /// </summary>
        public long Total { get; set; }

        /// <summary>
        /// 總共頁數。
        /// </summary>
        public int TotalPage => Total % PageSize == 0 ? (int)((Total / PageSize)) : (int)((Total / PageSize) + 1);

        /// <summary>
        /// 排序欄位。
        /// </summary>
        public string SortBy { get; set; }

        /// <summary>
        /// 排序方式為升冪（asc）或降冪（desc），預設為 desc。
        /// </summary>
        public SortDirectionEnum Order { get; set; } = SortDirectionEnum.DESC;
    }
}
