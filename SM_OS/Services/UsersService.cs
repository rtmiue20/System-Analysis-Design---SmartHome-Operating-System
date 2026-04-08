using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IConfiguration _config;

        public UsersService(IUsersRepository userRepo, IConfiguration config)
        {
            _userRepo = userRepo;
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
            var user = await _userRepo.GetByUsernameAsync(username);
            // Kiểm tra user tồn tại và mật khẩu khớp (Ở đây đang so sánh chuỗi thô)
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                return null;
            return user;
        }

        //public string GenerateJwtToken(User user)
        //{
        //    var claims = new[]
        //    {
        //        new Claim(ClaimTypes.Name, user.Username),
        //        new Claim(ClaimTypes.Role, user.Role)
        //    };

        //    // Lưu ý: Key phải dài trên 16 ký tự
        //    var jwtSettings = _config.GetSection("Jwt");
        //    var keyString = jwtSettings["Key"] ?? "Default_Secret_Key_1234567890123456"; // Cung cấp giá trị mặc định nếu không có trong config
        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //    var token = new JwtSecurityToken(
        //        issuer: jwtSettings["Issuer"],     // Khớp Issuer
        //        audience: jwtSettings["Audience"], // Khớp Audience
        //        claims: claims,
        //        expires: DateTime.Now.AddHours(2),
        //        signingCredentials: creds
        //        );

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}
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

