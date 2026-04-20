namespace SM_OS.DTOs
{
    public class DeviceStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty; // "On", "Off"

        // Các thông số phụ cho giao diện AC/Quạt
        public int? Temperature { get; set; }
        public string? Mode { get; set; }
        public int? FanSpeed { get; set; }
    }
}