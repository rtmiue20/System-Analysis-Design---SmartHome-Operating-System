using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context;
        public RoomRepository(ApplicationDbContext context) => _context = context;

        // 1. C - Create
        public async Task<Room> CreateAsync(Room room) 
        {
            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
            return room;
        }

        // 2. R - Read
        public async Task<IEnumerable<Room>> GetAllAsync() =>
           await _context.Rooms.Include(r => r.SmartDevices).ToListAsync(); 

        public async Task<Room?> GetByIdAsync(int id) =>
            await _context.Rooms.Include(r => r.SmartDevices).FirstOrDefaultAsync(r => r.RoomId == id); 

        // 3. U - Update
        public async Task<bool> UpdateAsync(Room room) 
        {
            _context.Rooms.Update(room);
            return await _context.SaveChangesAsync() > 0;
        }

        // 4. D - Delete
        public async Task<bool> DeleteAsync(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return false;
            _context.Rooms.Remove(room);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}