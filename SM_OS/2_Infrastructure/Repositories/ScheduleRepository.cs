using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. C - Create
        public async Task<DeviceSchedule> CreateAsync(DeviceSchedule schedule)
        {
            _context.DeviceSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        // 2. R - Read
        public async Task<IEnumerable<DeviceSchedule>> GetAllAsync()
        { 
            return await _context.DeviceSchedules
                .Include(s => s.SmartDevice)
                .ToListAsync();
        }

        public async Task<DeviceSchedule?> GetByIdAsync(int id)
        {
            return await _context.DeviceSchedules
                .Include(s => s.SmartDevice)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        // 3. U - Update
        public async Task UpdateAsync(DeviceSchedule schedule)
        {
            _context.DeviceSchedules.Update(schedule);
            await _context.SaveChangesAsync();
        }

        // 4. D - Delete
        public async Task DeleteAsync(int id)
        {
            var schedule = await _context.DeviceSchedules.FindAsync(id);
            if (schedule != null)
            {
                _context.DeviceSchedules.Remove(schedule);
                await _context.SaveChangesAsync();
            }
        }
    }
}