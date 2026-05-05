using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class SchedulesService : ISchedulesService
    {
        private readonly IScheduleRepository _scheduleRepository;

        public SchedulesService(IScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        // 1. C - Create
        public async Task<DeviceSchedule> CreateScheduleAsync(DeviceSchedule schedule)
        {
            return await _scheduleRepository.CreateAsync(schedule);
        }

        // 2. R - Read
        public async Task<IEnumerable<DeviceSchedule>> GetAllSchedulesAsync()
        {
            return await _scheduleRepository.GetAllAsync();
        }

        public async Task<DeviceSchedule?> GetScheduleByIdAsync(int id)
        {
            return await _scheduleRepository.GetByIdAsync(id);
        }

        // 3. U - Update
        public async Task UpdateScheduleAsync(DeviceSchedule schedule)
        {
            await _scheduleRepository.UpdateAsync(schedule);
        }

        // 4. D - Delete
        public async Task DeleteScheduleAsync(int id)
        {
            await _scheduleRepository.DeleteAsync(id);
        }
    }
}