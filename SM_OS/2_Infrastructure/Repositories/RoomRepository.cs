using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context; // Sử dụng ApplicationDbContext để truy cập cơ sở dữ liệu
        public RoomRepository(ApplicationDbContext context) => _context = context; // Dependency Injection để nhận ApplicationDbContext từ bên ngoài

        public async Task<IEnumerable<Room>> GetAllAsync() =>
           await _context.Rooms.Include(r => r.SmartDevices).ToListAsync(); // Lấy tất cả phòng và bao gồm thiết bị thông minh liên quan

        public async Task<Room?> GetByIdAsync(int id) =>
            await _context.Rooms.Include(r => r.SmartDevices).FirstOrDefaultAsync(r => r.RoomId == id); // Lấy phòng theo ID và bao gồm thiết bị thông minh liên quan

        public async Task<Room> CreateAsync(Room room) // Tạo mới một phòng và lưu vào DB
        {
            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> UpdateAsync(Room room) // Cập nhật thông tin của một phòng đã tồn tại và lưu vào DB
        {
            _context.Rooms.Update(room);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id) // Xóa một phòng theo ID và lưu vào DB
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return false;
            _context.Rooms.Remove(room);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}