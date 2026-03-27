using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SM_OS.Entities
{
    public class SmartDevice
    {
        [Key]
        public int DeviceId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; //("Đèn phòng khách", "Quạt phòng ngủ", ...)

        [StringLength(50)]
        public string Type { get; set; } = string.Empty; //("Light", "Fan", "Thermostat", ...)

        [StringLength(20)]
        public string Status { get; set; } = "Off"; // ("On", "Off", "Standby", ...)

        [Required]
        public int RoomId { get; set; } // Khóa ngoại liên kết với Room

        [ForeignKey("RoomId")]
        public Room Room { get; set; } = null!; // Điều hướng đến Room, null! để tránh cảnh báo về giá trị null
    }
}