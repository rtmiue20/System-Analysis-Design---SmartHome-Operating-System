namespace SM_OS.DTOs
{
    // DTO để nhận list các hành động bên trong ngữ cảnh
    public class SceneActionCreateDTO
    {
        public int SmartDeviceId { get; set; }
        public string TargetStatus { get; set; } = string.Empty;
    }

    // DTO chính để nhận request tạo Scene
    public class SceneCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }

        // Tên biến này phải khớp với chữ "sceneActions" trên Postman của bạn
        public List<SceneActionCreateDTO> SceneActions { get; set; } = new List<SceneActionCreateDTO>();
    }
}