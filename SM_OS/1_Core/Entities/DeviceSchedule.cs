using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SM_OS.Entities
{
    public class DeviceSchedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public TimeSpan TriggerTime { get; set; } // Thời gian kích hoạt (VD: 18:00:00)

        [Required]
        public string DaysOfWeek { get; set; } = string.Empty; // Ngày lặp lại (VD: "Monday,Tuesday" hoặc "Everyday")

        [Required]
        public string TargetStatus { get; set; } = string.Empty; // Trạng thái muốn đổi thành (VD: "On", "Off")

        public bool IsActive { get; set; } = true; // Trạng thái bật/tắt của chính cái lịch hẹn này

        // Khóa ngoại liên kết tới thiết bị cần hẹn giờ
        public int SmartDeviceId { get; set; }

        [ForeignKey("SmartDeviceId")]
        public SmartDevice SmartDevice { get; set; } = null!;
    }
}