namespace SM_OS.DTOs
{
    // DTO để nhận list các hành động bên trong ngữ cảnh
    public class SceneActionCreateDTO
    {
        public int SmartDeviceId { get; set; }
        public string TargetStatus { get; set; } = string.Empty;
    }

}