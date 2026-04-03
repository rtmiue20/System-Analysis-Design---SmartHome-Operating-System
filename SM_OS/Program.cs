using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Repositories;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using SM_OS.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using SM_OS.Hubs;

var builder = WebApplication.CreateBuilder(args);

// --- CẤU HÌNH SERILOG TẠI ĐÂY ---
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Ghi log ra màn hình đen (Console)
    .WriteTo.File("Logs/smarthome_log.txt", rollingInterval: RollingInterval.Day) // Ghi vào file theo ngày
    .CreateLogger();

builder.Host.UseSerilog();

// 1. Cấu hình kết nối MariaDB/MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Đăng ký Dependency Injection (DI)
// Đăng ký Repositories
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IDevicesRepository, DevicesRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();

// Đăng ký Services
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IDevicesService, DevicesService>();
builder.Services.AddScoped<IUsersService, UsersService>();

// 3. Đăng ký các dịch vụ hệ thống
builder.Services.AddControllers();
// Thêm cấu hình để tránh lỗi vòng lặp JSON khi include Entities
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
//var keyString = jwtSettings["Key"] ?? "Default_Secret_Key_1234567890123456";
//var key = Encoding.UTF8.GetBytes(keyString);

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = jwtSettings["Issuer"],      // Đọc từ json
//            ValidAudience = jwtSettings["Audience"],  // Đọc từ json
//            IssuerSigningKey = new SymmetricSecurityKey(key)
//        };
//    });
var keyString = jwtSettings["Key"] ?? "Default_Secret_Key_1234567890123456";
var issuer = jwtSettings["Issuer"] ?? "smarthome";
var audience = jwtSettings["Audience"] ?? "smarthome";

var key = Encoding.UTF8.GetBytes(keyString);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,      
            ValidAudience = audience,  
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = builder.Build();

// 4. Cấu hình HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseMiddleware<SM_OS.Middlewares.ExceptionMiddleware>();
app.UseAuthentication();
// Chèn Middleware cho Authorization nếu sau này bạn làm Login/JWT
app.UseAuthorization();

app.MapControllers();
app.MapHub<SmartHomeHub>("/smarthomehub");
app.Run();