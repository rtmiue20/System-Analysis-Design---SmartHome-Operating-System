using System.ComponentModel.DataAnnotations;

namespace SM_OS.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty; //("huy222", "alice123", ...)

        [Required]
        public string Password { get; set; } = string.Empty; // Lưu mật khẩu đã được hash ("123456" -> " e10adc3949ba59abbe56e057f20f883e")

        [StringLength(100)]
        public string FullName { get; set; } = string.Empty; //("Huy Nguyen", "Alice Smith", ...)

        [EmailAddress]
        public string Email { get; set; } = string.Empty; // ("test@gmail.com", ...)

        [StringLength(20)]
        public string Role { get; set; } = "User"; // ("HomeOwner", "FamilyMember", "Guest", ...)

    }
}