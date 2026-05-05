using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface IScheduleRepository
    {
        Task<DeviceSchedule> CreateAsync(DeviceSchedule schedule);
        Task<IEnumerable<DeviceSchedule>> GetAllAsync();
        Task<DeviceSchedule?> GetByIdAsync(int id);
        Task UpdateAsync(DeviceSchedule schedule);
        Task DeleteAsync(int id);
    }
}