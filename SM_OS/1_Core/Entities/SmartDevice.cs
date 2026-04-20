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
        public string Name { get; set; } = string.Empty; //("Đèn phòng khách", "Điều hòa phòng ngủ", ...)

        [StringLength(50)]
        public string Type { get; set; } = string.Empty; //("Light", "Thermostat", "Camera", "Lock", ...)

        [StringLength(20)]
        public string Status { get; set; } = "Off"; //("On", "Off", "Locked", "Unlocked", "Recording", ...)

        // BỔ SUNG 
        public DateTime? LastSeen { get; set; } // Lưu thời gian online cuối cùng
        public string? AdditionalData { get; set; } // Chứa chuỗi JSON: {"temp": 24, "mode": "Cool"}

        [Required]
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; } = null!;
    }
}