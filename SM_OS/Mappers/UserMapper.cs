using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Mappers
{
    public static class UserMapper
    {
        public static User ToEntity(this UserRegisterDTO dto)
        {
            return new User
            {
                Username = dto.Username,
                Password = dto.Password, // Lưu ý: Cần Hash trước khi gọi ToEntity ở Service
                FullName = dto.FullName,
                Email = dto.Email,
                Role = "User"
            };
        }

        public static object ToResponseDto(this User user)
        {
            return new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.Role
            };
        }
    }
}