using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Mappers
{
    public static class RoomMapper
    {
        // Chuyển từ DTO sang Entity để lưu vào DB
        public static Room ToEntity(this RoomCreateDTO dto)
        {
            return new Room
            {
                RoomName = dto.Name,
                Description = dto.Description
            };
        }

        // Chuyển từ Entity sang object để trả về API (nếu cần)
        public static object ToResponseDto(this Room room)
        {
            return new
            {
                room.RoomId,
                room.RoomName,
                room.Description,
                DeviceCount = room.SmartDevices?.Count ?? 0
            };
        }
    }
}