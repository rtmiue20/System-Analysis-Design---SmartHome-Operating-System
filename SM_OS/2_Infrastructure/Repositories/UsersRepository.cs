using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly ApplicationDbContext _context;
        public UsersRepository(ApplicationDbContext context) => _context = context;

        public async Task<User?> GetByUsernameAsync(string username) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Username == username); // Lấy người dùng theo tên đăng nhập

        public async Task<User?> GetByIdAsync(int id) =>
            await _context.Users.FindAsync(id); // Lấy người dùng theo ID

        public async Task<User> CreateAsync(User user) // Tạo mới một người dùng và lưu vào DB
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExistsAsync(string username) =>
            await _context.Users.AnyAsync(u => u.Username == username); // Kiểm tra xem người dùng đã tồn tại theo tên đăng nhập hay chưa
    }
}