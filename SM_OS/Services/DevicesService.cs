using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Mappers;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;
using SM_OS.Hubs;

namespace SM_OS.Services
{
    public class DevicesService : IDevicesService
    {
        private readonly IDevicesRepository _deviceRepo;
        private readonly IRoomRepository _roomRepo; // Cần check xem phòng có tồn tại không
        private readonly ILogger<DevicesService> _logger; // Ghi log
        public DevicesService(IDevicesRepository deviceRepo, IRoomRepository roomRepo, ILogger<DevicesService> logger)
        {
            _deviceRepo = deviceRepo;
            _roomRepo = roomRepo;
            _logger = logger;
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

        public async Task<bool> UpdateStatusAsync(int id, string status, string userName)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            if (device == null)
            {
                // Ghi log cảnh báo khi không tìm thấy thiết bị
                _logger.LogWarning("No device ID {Id} found to update", id);
                return false;
            }
            device.Status = status;
            var result = await _deviceRepo.UpdateAsync(device);

            if (result)
            {
                // ĐÂY CHÍNH LÀ LƯU VẾT: Ai? (userName), Làm gì? (status), Lúc nào? (Serilog tự ghi)
                _logger.LogInformation("User {User} has changed the device status {Id} to {Status}",userName, id, status);
            }

            return result;
        }

        public async Task<bool> DeleteDeviceAsync(int id) => await _deviceRepo.DeleteAsync(id);
    }
}