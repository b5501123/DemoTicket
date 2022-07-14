
using Common.Helpers;
using Demo.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddServices(builder.Configuration);
builder.Services.AddJWTAuthentication();
builder.Services.AddHttpContextAccessor();

string keyCorsPolicy = "CorsPolicy";
builder.Services.AddCorsServer(keyCorsPolicy);

var app = builder.Build();

// Configure the HTTP request pipeline.


app.UseSwaggerDocumentation();
app.UseHttpsRedirection();

app.UseDemoExcptionHaddler();

app.UseCors(keyCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
