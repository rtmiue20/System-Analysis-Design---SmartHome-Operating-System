using BCrypt.Net;
using Microsoft.EntityFrameworkCore; 
using SM_OS.Data; 
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
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public UsersService(IUsersRepository userRepo, ApplicationDbContext context, IConfiguration config)
        {
            _userRepo = userRepo;
            _context = context;
            _config = config;
        }

        // 1. Register
        public async Task<User?> RegisterAsync(UserRegisterDTO dto)
        {
            if (await _userRepo.UserExistsAsync(dto.Username)) return null;

            var user = new User
            {
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Email = dto.Email,
                Role = "HomeOwner"
            };
            return await _userRepo.CreateAsync(user);
        }

        // 2. Login
        public async Task<User?> LoginAsync(string username, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null) return null;
           
            try
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
                if (!isPasswordValid) return null; 
            }
            catch (System.Exception)
            {           
                if (user.Password != password) return null;
            }

            return user; 
        }

        // 3. Generate JWT Token
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