using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface IUsersService
    {
        Task<User?> RegisterAsync(UserRegisterDTO dto);
        Task<User?> LoginAsync(string username, string password);
        string GenerateJwtToken(User user);
    }
}