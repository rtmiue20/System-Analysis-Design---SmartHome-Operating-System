using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Mappers;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class DevicesService : IDevicesService
    {
        private readonly IDevicesRepository _deviceRepo;
        private readonly IRoomRepository _roomRepo; // Cần check xem phòng có tồn tại không

        public DevicesService(IDevicesRepository deviceRepo, IRoomRepository roomRepo)
        {
            _deviceRepo = deviceRepo;
            _roomRepo = roomRepo;
        }

        public async Task<IEnumerable<SmartDevice>> GetAllDevicesAsync() => await _deviceRepo.GetAllAsync();

        public async Task<SmartDevice?> GetDeviceByIdAsync(int id) => await _deviceRepo.GetByIdAsync(id);

        public async Task<SmartDevice?> AddDeviceAsync(DeviceCreateDTO dto)
        {
            var room = await _roomRepo.GetByIdAsync(dto.RoomId);
            if (room == null) return null;

            // Sử dụng Mapper
            var device = dto.ToEntity();
            return await _deviceRepo.CreateAsync(device);
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            if (device == null) return false;

            device.Status = status;
            return await _deviceRepo.UpdateAsync(device);
        }

        public async Task<bool> DeleteDeviceAsync(int id) => await _deviceRepo.DeleteAsync(id);
    }
}