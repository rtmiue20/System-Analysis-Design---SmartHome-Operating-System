using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface IDevicesService
    {
        Task<IEnumerable<SmartDevice>> GetAllDevicesAsync();
        Task<SmartDevice?> GetDeviceByIdAsync(int id);
        Task<SmartDevice?> AddDeviceAsync(DeviceCreateDTO dto); // Trả về null nếu RoomId không tồn tại
        Task<bool> UpdateStatusAsync(int id, string status, string userName);
        Task<bool> DeleteDeviceAsync(int id);
        Task<bool> UpdateDeviceAsync(int id, DeviceCreateDTO dto);
    }
}