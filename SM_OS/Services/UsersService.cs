using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepo;
        public UsersService(IUsersRepository userRepo) => _userRepo = userRepo;

        public async Task<User?> RegisterAsync(UserRegisterDTO dto)
        {
            if (await _userRepo.UserExistsAsync(dto.Username)) return null;

            var user = new User
            {
                Username = dto.Username,
                Password = dto.Password,
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
            if (user == null || user.Password != password) return null;

            return user;
        }
    }
}