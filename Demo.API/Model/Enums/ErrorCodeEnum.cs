using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Enums
{
    public enum ErrorCodeEnum
    {
        [Description("權限不足")]
        PermissionError = 2001,

        [Description("操作錯誤")]
        ActionError = 2002,

        [Description("密碼輸入錯誤")]
        PasswordError = 2003,

        [Description("查無此帳號")]
        AccountNotFound = 2004,


        [Description("找不到該筆資料")]
        DataNotFound = 2005,

        [Description("資料異動失敗")]
        DataUpdateError = 2006,

        [Description("內部錯誤")]
        InternalError = 9999
    }
}
