using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface IRoomService
    {
        Task<Room> AddRoomAsync(RoomCreateDTO dto);
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room?> GetRoomByIdAsync(int id);
        Task<bool> UpdateRoomAsync(int id, RoomCreateDTO dto);
        Task<bool> DeleteRoomAsync(int id);
    }
}