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

        public async Task<IEnumerable<SmartDevice>> GetAllAsync() =>
            await _context.SmartDevices.AsNoTracking().Include(d => d.Room).ToListAsync(); // Lấy tất cả thiết bị thông minh và bao gồm thông tin phòng liên quan - AsNoTracking() để tối ưu hiệu suất khi chỉ đọc dữ liệu mà không cần theo dõi thay đổi

        public async Task<SmartDevice?> GetByIdAsync(int id) =>
            await _context.SmartDevices.Include(d => d.Room).FirstOrDefaultAsync(d => d.DeviceId == id);  // Lấy thiết bị thông minh theo ID, không bao gồm thông tin phòng liên quan - AsNoTracking() để tối ưu hiệu suất khi chỉ đọc dữ liệu mà không cần theo dõi thay đổi

        public async Task<SmartDevice> CreateAsync(SmartDevice device)  // Tạo mới một thiết bị thông minh và lưu vào DB
        {
            await _context.SmartDevices.AddAsync(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task<bool> UpdateAsync(SmartDevice device) // Cập nhật thông tin của một thiết bị thông minh đã tồn tại và lưu vào DB
        {
            _context.SmartDevices.Update(device);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id) // Xóa một thiết bị thông minh theo ID và lưu vào DB
        {
            var device = await _context.SmartDevices.FindAsync(id);
            if (device == null) return false;
            _context.SmartDevices.Remove(device);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}