using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model.Enums;
using Common.Extensions;
namespace Model.Exceptions
{
    public class DemoException : Exception
    {
        public DemoException()
        {
        }

        public DemoException(string message)
            : base(message)
        {
            ErrorCode = ErrorCodeEnum.InternalError.GetHashCode();
        }

        public DemoException(ErrorCodeEnum errorCode,string message = null)
            : base(InitMessage(errorCode,message))
        {
            ErrorCode = errorCode.GetHashCode();
        }

        private static string InitMessage(ErrorCodeEnum errorCode, string message = null)
        {
            return message.IsEmptyOrNull() ? errorCode.GetDescription() : message;
        }

        public int ErrorCode { get; set; }
    }
}
