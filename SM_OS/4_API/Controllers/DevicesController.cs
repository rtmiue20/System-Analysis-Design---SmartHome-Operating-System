using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Mappers;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Yêu cầu xác thực cho tất cả các endpoint trong controller này
    public class DevicesController : ControllerBase
    {
        private readonly IDevicesService _deviceService;

        public DevicesController(IDevicesService deviceService)
        {
            _deviceService = deviceService;
        }

        // 1. POST
        [HttpPost]
        public async Task<IActionResult> Create(DeviceCreateDTO dto)
        {
            var device = await _deviceService.AddDeviceAsync(dto);
            if (device == null) return BadRequest("RoomId không tồn tại!");
            return Ok(device.ToResponseDto());
        }

        // 2. GET
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _deviceService.GetAllDevicesAsync());

        // 3. PATCH
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var userName = User.Identity?.Name ?? "Unknown User";
            var success = await _deviceService.UpdateStatusAsync(id, status, userName);

            if (success) return Ok(new { message = "Cập nhật trạng thái thành công" });
            return NotFound("Không tìm thấy thiết bị");
        }

        // 4. PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DeviceCreateDTO dto)
        {
            var success = await _deviceService.UpdateDeviceAsync(id, dto);
            if (!success) return NotFound("Không tìm thấy thiết bị hoặc RoomId không hợp lệ");
            return Ok(new { message = "Cập nhật thông tin thiết bị thành công" });
        }

        // 5. DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _deviceService.DeleteDeviceAsync(id);
            if (!success) return NotFound("Không tìm thấy thiết bị để xóa");
            return Ok(new { message = "Đã xóa thiết bị thành công" });
        }
    }
}