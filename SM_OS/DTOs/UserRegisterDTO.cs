using System.ComponentModel.DataAnnotations;

namespace SM_OS.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}