using BCrypt.Net;
using Microsoft.EntityFrameworkCore; // Thêm thư viện này để dùng SingleOrDefaultAsync
using Microsoft.IdentityModel.Tokens;
using SM_OS.Data; // Thêm thư viện này để gọi ApplicationDbContext
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SM_OS.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepo;
        private readonly ApplicationDbContext _context; // Khai báo thẳng _context ở đây
        private readonly IConfiguration _config;

        // Bơm ApplicationDbContext vào chung luôn
        public UsersService(IUsersRepository userRepo, ApplicationDbContext context, IConfiguration config)
        {
            _userRepo = userRepo;
            _context = context;
            _config = config;
        }

        public async Task<User?> RegisterAsync(UserRegisterDTO dto)
        {
            if (await _userRepo.UserExistsAsync(dto.Username)) return null;

            var user = new User
            {
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Role = "HomeOwner" // Mặc định role khi đăng ký
            };
            return await _userRepo.CreateAsync(user);
        }

        public async Task<User?> LoginAsync(string username, string password)
        {
            // Quay lại cách cũ: Lấy trực tiếp từ _context!
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null) return null; // Không tìm thấy user

            // Đề phòng trường hợp account trong DB của bạn đang dùng pass chữ thường (chưa băm)
            try
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
                if (!isPasswordValid) return null; // Sai mật khẩu
            }
            catch (System.Exception)
            {
                // Nếu mật khẩu trong DB không phải dạng BCrypt (do bạn thêm bằng tay vào DB)
                // thì so sánh chuỗi bình thường luôn để test cho dễ
                if (user.Password != password) return null;
            }

            return user; // Đăng nhập thành công
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var jwtSettings = _config.GetSection("Jwt");

            var keyString = jwtSettings["Key"] ?? "Default_Secret_Key_1234567890123456";
            var issuer = jwtSettings["Issuer"] ?? "smarthome";
            var audience = jwtSettings["Audience"] ?? "smarthome";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}