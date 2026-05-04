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
        private readonly IRoomRepository _roomRepo;
        private readonly ILogger<DevicesService> _logger;
        private readonly IHubContext<SmartHomeHub> _hubContext;

        public DevicesService(
        IDevicesRepository deviceRepo,
        IRoomRepository roomRepo,
        ILogger<DevicesService> logger,
        IHubContext<SmartHomeHub> hubContext)
        {
            _deviceRepo = deviceRepo;
            _roomRepo = roomRepo;
            _logger = logger;
            _hubContext = hubContext;
        }

        // 1. C - Create
        public async Task<SmartDevice?> AddDeviceAsync(DeviceCreateDTO dto)
        {
            var room = await _roomRepo.GetByIdAsync(dto.RoomId);
            if (room == null) return null;

            var device = dto.ToEntity();
            return await _deviceRepo.CreateAsync(device);
        }

        // 2. R - Read
        public async Task<IEnumerable<SmartDevice>> GetAllDevicesAsync() => await _deviceRepo.GetAllAsync();

        public async Task<SmartDevice?> GetDeviceByIdAsync(int id) => await _deviceRepo.GetByIdAsync(id);

        // 3. U - Update
        public async Task<bool> UpdateStatusAsync(int id, string status, string userName)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            if (device == null) return false;

            device.Status = status;
            var result = await _deviceRepo.UpdateAsync(device);

            if (result)
            {
                _logger.LogInformation("User {User} changed device {Id} to {Status}", userName, id, status);

                bool isDeviceOn = status.Equals("On", StringComparison.OrdinalIgnoreCase) ||
                                  status.Equals("True", StringComparison.OrdinalIgnoreCase);
                await _hubContext.Clients.All.SendAsync("ReceiveDeviceUpdate", id, isDeviceOn);
            }
            return result;
        }

        public async Task<bool> UpdateDeviceAsync(int id, DeviceCreateDTO dto)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            if (device == null) return false;

            var roomExists = await _roomRepo.GetByIdAsync(dto.RoomId);
            if (roomExists == null) return false;

            device.Name = dto.Name;

            device.Type = dto.Type;

            device.RoomId = dto.RoomId;

            return await _deviceRepo.UpdateAsync(device);
        }

        // 4. D - Delete
        public async Task<bool> DeleteDeviceAsync(int id) => await _deviceRepo.DeleteAsync(id);
    }
}