namespace Demo.API.Response
{
    public class ApiResponse<T> : BaseRes
    {
        public T Data { get; set; }

        public static ApiResponse<T> Ok(T result)
        {
            return new ApiResponse<T>
            {
                Data = result,
            };
        }

        public static ApiResponse<T> NotOk(int errcode, string msg, T data = default)
        {
            return new ApiResponse<T>
            {
                ErrCode = errcode,
                ErrMsg = msg,
                Data = data,
            };
        }
    }
}
