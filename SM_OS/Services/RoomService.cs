using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Mappers;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepo;
        public RoomService(IRoomRepository roomRepo) => _roomRepo = roomRepo;

        public async Task<IEnumerable<Room>> GetAllRoomsAsync() => await _roomRepo.GetAllAsync();

        public async Task<Room?> GetRoomByIdAsync(int id) => await _roomRepo.GetByIdAsync(id);

        public async Task<Room> AddRoomAsync(RoomCreateDTO dto)
        {
            var room = dto.ToEntity(); // Sử dụng Mapper ở đây
            return await _roomRepo.CreateAsync(room);
        }

        public async Task<bool> UpdateRoomAsync(int id, RoomCreateDTO dto)
        {
            var room = await _roomRepo.GetByIdAsync(id);
            if (room == null) return false;

            room.RoomName = dto.Name;
            room.Description = dto.Description;
            return await _roomRepo.UpdateAsync(room);
        }

        public async Task<bool> DeleteRoomAsync(int id) => await _roomRepo.DeleteAsync(id);
    }
}