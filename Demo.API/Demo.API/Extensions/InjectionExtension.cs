using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Common.Helpers;
using Model.DbContexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Model.Info;

namespace Demo.API.Extensions
{
    public static class InjectionExtension
    {
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            _ = new ConfigHelper(configuration);
            services.AddScoped<UserInfo>();
            services.AddMySql();
            services.InjectionService("Repository", "Repository");

            return services;
        }

        public static void InjectionService(this IServiceCollection services, string assemblyName, string suffixName)
        {

            var assembly = Assembly.Load(assemblyName);
            var types = assembly.GetTypes().Where(x => x.Name.EndsWith(suffixName) && x.IsClass && !x.IsAbstract);
            var list = types.ToList();
            foreach (var s in types)
            {
                var iService = s.GetInterface($"I{s.Name}");
                if (iService != null)
                {
                    services.AddScoped(iService, s);
                }
                else
                {
                    services.AddScoped(s);
                }
            }
        }

        public static void AddMySql(this IServiceCollection services)
        {
            string resdString = ConfigHelper.ReadMqlConnectionString;
            string connectionString = ConfigHelper.WriteMqlConnectionString;
            ServerVersion serverVersion = ServerVersion.AutoDetect(connectionString);
            ServerVersion resdServerVersion = ServerVersion.AutoDetect(resdString);

            services.AddDbContext<WriteDemoDbContext>(options =>
            options.UseMySql(connectionString, serverVersion));

            services.AddDbContext<ReadDemoDbContext>(options =>
            {
                options.UseMySql(resdString, resdServerVersion);
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });
        }

        public static void AddCorsServer(this IServiceCollection services,string keyCorsPolicy)
        {
            services.AddCors(options => options.AddPolicy(
                keyCorsPolicy,
                builder =>
                {
                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetIsOriginAllowed(_ => true)
                        .AllowCredentials();
                }));
        }

        public static IServiceCollection AddJWTAuthentication(this IServiceCollection services)
        {
            var key = ConfigHelper.SignKey;
            var issuer = ConfigHelper.Issuer;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.IncludeErrorDetails = true; // 預設值為 true，有時會特別關閉

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // 透過這項宣告，就可以從 "sub" 取值並設定給 User.Identity.Name
                        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
                        // 透過這項宣告，就可以從 "roles" 取值，並可讓 [Authorize] 判斷角色
                        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",

                        // 一般我們都會驗證 Issuer
                        ValidateIssuer = true,
                        ValidIssuer = issuer,

                        // 通常不太需要驗證 Audience
                        ValidateAudience = false,
                        //ValidAudience = "JwtAuthDemo", // 不驗證就不需要填寫

                        // 一般我們都會驗證 Token 的有效期間
                        ValidateLifetime = true,

                        // 如果 Token 中包含 key 才需要驗證，一般都只有簽章而已
                        ValidateIssuerSigningKey = false,

                        // "1234567890123456" 應該從 IConfiguration 取得
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                    };
                });

            return services;
        }
        

        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo", Version = "v1.0.0" });

                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                c.AddSecurityDefinition("Bearer", securitySchema);

                var securityRequirement = new OpenApiSecurityRequirement
                {
                    { securitySchema, new[] { "Bearer" } }
                };

                c.AddSecurityRequirement(securityRequirement);

            });
            return services;
        }

        public static WebApplication UseSwaggerDocumentation(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            return app;
        }
    }
}
