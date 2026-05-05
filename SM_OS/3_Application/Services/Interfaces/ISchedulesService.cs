using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface ISchedulesService
    {
        Task<DeviceSchedule> CreateScheduleAsync(DeviceSchedule schedule);
        Task<IEnumerable<DeviceSchedule>> GetAllSchedulesAsync();
        Task<DeviceSchedule?> GetScheduleByIdAsync(int id);
        Task UpdateScheduleAsync(DeviceSchedule schedule);
        Task DeleteScheduleAsync(int id);
    }
}