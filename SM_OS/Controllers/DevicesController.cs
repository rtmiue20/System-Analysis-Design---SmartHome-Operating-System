using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SM_OS.DTOs;
using SM_OS.Hubs;
using SM_OS.Hubs.Interface;
using SM_OS.Mappers;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly IDevicesService _deviceService;
        private readonly IHubContext<SmartHomeHub, ISmartHomeClient> _hubContext;

        public DevicesController(IDevicesService deviceService, IHubContext<SmartHomeHub, ISmartHomeClient> hubContext)
        {
            _deviceService = deviceService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _deviceService.GetAllDevicesAsync());

        [HttpPost]
        public async Task<IActionResult> Create(DeviceCreateDTO dto)
        {
            var device = await _deviceService.AddDeviceAsync(dto);
            if (device == null) return BadRequest("RoomId does not exist!");
            return Ok(device.ToResponseDto());
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var userName = User.Identity?.Name ?? "Unknown User";
            var success = await _deviceService.UpdateStatusAsync(id, status, userName);
            if (success)
            {
                bool isDeviceOn = status.Equals("On", StringComparison.OrdinalIgnoreCase) ||
                                  status.Equals("True", StringComparison.OrdinalIgnoreCase);

                await _hubContext.Clients.All.ReceiveDeviceUpdate(id, isDeviceOn);

                return Ok("Status update successful");
            }
            return NotFound();
        }
    }
}