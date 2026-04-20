namespace SM_OS.DTOs
{
    public class ScheduleCreateDTO
    {
        public TimeSpan ExecutionTime { get; set; }
        public string DaysOfWeek { get; set; } = string.Empty;
        public string ActionStatus { get; set; } = string.Empty;
        public int SmartDeviceId { get; set; }
    }
}