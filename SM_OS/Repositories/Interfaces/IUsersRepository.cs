using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface IUsersRepository
    {
        // Tìm người dùng theo Username
        Task<User?> GetByUsernameAsync(string username);

        // Tìm người dùng theo ID
        Task<User?> GetByIdAsync(int id);

        // Tạo người dùng mới
        Task<User> CreateAsync(User user);

        // Kiểm tra Username đã tồn tại chưa
        Task<bool> UserExistsAsync(string username);
    }
}