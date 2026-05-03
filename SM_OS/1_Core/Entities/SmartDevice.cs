using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Bắt buộc phải có dòng này

namespace SM_OS.Entities
{
    public class SmartDevice
    {
        [Key]
        public int DeviceId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(50)]
        public string Type { get; set; } = string.Empty;

        [StringLength(20)]
        public string Status { get; set; } = "Off";

        // BỔ SUNG: Chặn luôn cả 2 thằng này không cho EF quét dưới Database
        [NotMapped]
        public DateTime? LastSeen { get; set; }

        [NotMapped]
        public string? AdditionalData { get; set; }

        [Required]
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; } = null!;
    }
}