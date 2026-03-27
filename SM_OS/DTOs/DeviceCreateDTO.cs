namespace SM_OS.DTOs
{
    public class DeviceCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int RoomId { get; set; }
    }
}