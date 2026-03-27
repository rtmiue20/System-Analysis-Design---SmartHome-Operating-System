using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Mappers
{
    public static class DeviceMapper
    {
        public static SmartDevice ToEntity(this DeviceCreateDTO dto)
        {
            return new SmartDevice
            {
                Name = dto.Name,
                Type = dto.Type,
                RoomId = dto.RoomId,
                Status = "Off" // Trạng thái mặc định
            };
        }

        public static object ToResponseDto(this SmartDevice device)
        {
            return new
            {
                device.DeviceId,
                device.Name,
                device.Type,
                device.Status,
                RoomName = device.Room?.RoomName ?? "N/A"
            };
        }
    }
}