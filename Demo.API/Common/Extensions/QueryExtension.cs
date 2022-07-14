using Common.Options;
using Common.Enums;
using System.Linq.Expressions;

namespace Common.Extensions
{
    public static class QueryExtension
    {
        public static IQueryable<T> DoPaging<T>(this IQueryable<T> iqJoin, PaginationOption pager)
        {
            int skipCount = (pager.Page - 1) * pager.PageSize;

            if (string.IsNullOrWhiteSpace(pager.SortBy))
            {
                pager.SortBy = typeof(T).GetProperties().FirstOrDefault().Name;
            }

            bool isDESC = pager.Order == SortDirectionEnum.DESC;

            return iqJoin.OrderByField(pager.SortBy, isDESC).Skip(skipCount).Take(pager.PageSize);
        }
        /// <summary>
        /// Linq 進行 OrderBy 設定
        /// </summary>
        public static IQueryable<T> OrderByField<T>(this IQueryable<T> q, string SortField, bool Descending)
        {
            SortField = SortField.Trim();
            var param = Expression.Parameter(typeof(T), "p");
            var prop = Expression.Property(param, SortField);
            var exp = Expression.Lambda(prop, param);
            string method = Descending ? "OrderByDescending" : "OrderBy";
            Type[] types = new Type[] { q.ElementType, exp.Body.Type };
            var mce = Expression.Call(typeof(Queryable), method, types, q.Expression, exp);
            return q.Provider.CreateQuery<T>(mce);
        }

    }
}
