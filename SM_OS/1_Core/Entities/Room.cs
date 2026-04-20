using System.ComponentModel.DataAnnotations;

namespace SM_OS.Entities
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; } // ("R01", "R002", ...)

        [Required]
        [StringLength(100)]
        public string RoomName { get; set; } = string.Empty; //("Bếp của tôi", "Phòng khách của tôi", ...)

        public string Description { get; set; } = string.Empty; //("Phòng khách", "Phòng ngủ", ...)

        public ICollection<SmartDevice> SmartDevices { get; set; } = new List<SmartDevice>(); // Một phòng có nhiều thiết bị thông minh
    }
}