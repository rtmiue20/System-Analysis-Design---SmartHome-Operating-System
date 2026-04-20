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

        public async Task<bool> DeleteRoomAsync(int id)
        {
            // 1. Lấy phòng ra (nhờ hàm GetByIdAsync đã Include sẵn SmartDevices)
            var room = await _roomRepo.GetByIdAsync(id);
            if (room == null) return false;

            // 2. Chặn đứng việc xóa nếu phòng đang chứa thiết bị (Chuẩn AC-1.1)
            if (room.SmartDevices != null && room.SmartDevices.Any())
            {
                throw new InvalidOperationException("The room cannot be deleted because there is still equipment inside!");
            }

            // 3. Nếu phòng trống thì mới gọi Repository để xóa
            return await _roomRepo.DeleteAsync(id);
        }
    }
}