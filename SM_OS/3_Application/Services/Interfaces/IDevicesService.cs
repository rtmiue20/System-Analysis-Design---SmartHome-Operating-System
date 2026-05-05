using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface IDevicesService
    {
        Task<SmartDevice?> AddDeviceAsync(DeviceCreateDTO dto);
        Task<IEnumerable<SmartDevice>> GetAllDevicesAsync();
        Task<SmartDevice?> GetDeviceByIdAsync(int id);
        Task<bool> UpdateStatusAsync(int id, string status, string userName);
        Task<bool> UpdateDeviceAsync(int id, DeviceCreateDTO dto);
        Task<bool> DeleteDeviceAsync(int id);
    }
}