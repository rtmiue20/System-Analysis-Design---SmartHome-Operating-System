using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class DevicesRepository : IDevicesRepository
    {
        private readonly ApplicationDbContext _context;
        public DevicesRepository(ApplicationDbContext context) => _context = context;

        // 1. C - Create
        public async Task<SmartDevice> CreateAsync(SmartDevice device)
        {
            await _context.SmartDevices.AddAsync(device);
            await _context.SaveChangesAsync();
            return device;
        }

        // 2. R - Read
        public async Task<IEnumerable<SmartDevice>> GetAllAsync() =>
            await _context.SmartDevices.AsNoTracking().Include(d => d.Room).ToListAsync();

        public async Task<SmartDevice?> GetByIdAsync(int id) =>
            await _context.SmartDevices.Include(d => d.Room).FirstOrDefaultAsync(d => d.DeviceId == id);

        // 3. U - Update
        public async Task<bool> UpdateAsync(SmartDevice device)
        {
            _context.SmartDevices.Update(device);
            return await _context.SaveChangesAsync() > 0;
        }

        // 4. D - Delete
        public async Task<bool> DeleteAsync(int id) 
        {
            var device = await _context.SmartDevices.FindAsync(id);
            if (device == null) return false;
            _context.SmartDevices.Remove(device);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}