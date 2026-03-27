using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Mappers;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly IDevicesService _deviceService;
        public DevicesController(IDevicesService deviceService) => _deviceService = deviceService;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _deviceService.GetAllDevicesAsync());

        [HttpPost]
        public async Task<IActionResult> Create(DeviceCreateDTO dto)
        {
            var device = await _deviceService.AddDeviceAsync(dto);
            if (device == null) return BadRequest("RoomId không tồn tại!");
            return Ok(device.ToResponseDto());
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var success = await _deviceService.UpdateStatusAsync(id, status);
            return success ? Ok("Cập nhật trạng thái thành công") : NotFound();
        }
    }
}