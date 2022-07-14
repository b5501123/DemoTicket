using Common.Options;

namespace Demo.API.Response
{
    public class ApiListResponse<T> : BaseRes
    {
        public List<T> Data { get; set; }

        public PaginationOption Meta { get; set; }

        public static ApiListResponse<T> Ok(List<T> result, PaginationOption meta)
        {
            return new ApiListResponse<T>
            {
                Data = result,
                Meta = meta,
            };
        }

        public static ApiListResponse<T> NotOk(int errcode, string msg, List<T> data = default)
        {
            return new ApiListResponse<T>
            {
                ErrCode = errcode,
                ErrMsg = msg,
                Data = data,
            };
        }
    }
}
