using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SM_OS.Entities
{
    public class AutomationRule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string RuleName { get; set; } = string.Empty; // VD: "Bật máy lạnh khi quá nóng"

        [Required]
        public string ConditionOperator { get; set; } = string.Empty; // Các dấu: ">", "<", "==", ">="...

        public float ConditionValue { get; set; } // Ngưỡng kích hoạt (VD: 30.5)

        [Required]
        public string TargetStatus { get; set; } = string.Empty; // Trạng thái sẽ kích hoạt (VD: "On")

        public bool IsActive { get; set; } = true; // Bật/tắt luật này

        // 1. IF: Thiết bị cảm biến đóng vai trò làm điều kiện kiểm tra
        public int SensorDeviceId { get; set; }

        [ForeignKey("SensorDeviceId")]
        public SmartDevice SensorDevice { get; set; } = null!;

        // 2. THEN: Thiết bị đóng vai trò thực thi hành động
        public int ActionDeviceId { get; set; }

        [ForeignKey("ActionDeviceId")]
        public SmartDevice ActionDevice { get; set; } = null!;
    }
}