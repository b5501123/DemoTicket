using System.Text.Json;
using Demo.API.Response;
using Model.Exceptions;
using Model.Enums;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;

namespace Demo.API.Extensions
{
    public static class HandlerExtension
    {
        public static WebApplication UseDemoExcptionHaddler(this WebApplication app)
        {
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.ContentType = "application/json";
                    Exception ex = context.Features.Get<IExceptionHandlerPathFeature>()?.Error;
                   //LogManager.GetLogger("UncaughtException").Error(ex.ToString());

                   ErrorRes err;
                    if (typeof(DemoException).IsInstanceOfType(ex))
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        DemoException pex = (DemoException)ex;
                        err = new ErrorRes
                        {
                            ErrCode = pex.ErrorCode,
                            ErrMsg = pex.Message,
                        };
                    }
                    else
                    {
                        string errMsg;
                        if (app.Environment.IsProduction())
                        {
                            errMsg = "Unexpected internal error has occured.";
                        }
                        else
                        {
                            errMsg = ex.ToString();
                        }

                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        err = new ErrorRes
                        {
                            ErrCode = (int)ErrorCodeEnum.InternalError,
                            ErrMsg = errMsg,
                        };
                    }

                    await context.Response.WriteAsync(JsonSerializer.Serialize(err));
                });
            });
            return app;
        }
    }
}
