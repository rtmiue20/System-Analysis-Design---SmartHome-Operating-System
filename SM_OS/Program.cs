using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Repositories;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using SM_OS.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Cấu hình HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Chèn Middleware cho Authorization nếu sau này bạn làm Login/JWT
app.UseAuthorization();

app.MapControllers();

app.Run();