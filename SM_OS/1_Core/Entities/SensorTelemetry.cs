using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SM_OS.Entities
{
    public class SensorTelemetry
    {
        [Key]
        public int Id { get; set; }

        public float Value { get; set; } // Giá trị đo được (VD: 28.5 cho nhiệt độ, hoặc 60 cho độ ẩm)

        public DateTime Timestamp { get; set; } = DateTime.Now; // Thời điểm ghi nhận hệ thống

        // Khóa ngoại liên kết tới cảm biến đã gửi dữ liệu này
        public int SmartDeviceId { get; set; }

        [ForeignKey("SmartDeviceId")]
        public SmartDevice SmartDevice { get; set; } = null!;
    }
}