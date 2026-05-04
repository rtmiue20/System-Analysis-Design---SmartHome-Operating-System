using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Bảo mật: Chỉ người dùng có Token mới được quản lý ngữ cảnh
    public class ScenesController : ControllerBase
    {
        private readonly ISceneService _sceneService;


        // 1. POST
        [HttpPost]
        public async Task<IActionResult> Create(SceneCreateDTO dto)
        {
            var scene = await _sceneService.AddSceneAsync(dto);

            if (scene == null)
                return BadRequest("Tạo ngữ cảnh thất bại! Vui lòng kiểm tra lại UserId hoặc danh sách SmartDeviceId.");

            return Ok(new { message = "Tạo ngữ cảnh thành công!", sceneId = scene.Id });
        }

        [HttpPost("{id}/execute")]
        public async Task<IActionResult> Execute(int id)
        {
            var userName = User.Identity?.Name ?? "Automation System";
            var success = await _sceneService.ExecuteSceneAsync(id, userName);

            if (!success) return NotFound("Không tìm thấy ngữ cảnh này!");

            return Ok(new { message = $"Ngữ cảnh ID {id} đã được kích hoạt thành công." });
        }

        // 2. GET
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserScenes(int userId)
        {
            var scenes = await _sceneService.GetUserScenesAsync(userId);
            return Ok(scenes);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllScenes()
        {
            var scenes = await _sceneService.GetAllScenesAsync();
            return Ok(scenes);
        }

        public ScenesController(ISceneService sceneService)
        {
            _sceneService = sceneService;
        }

        //3. PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SceneCreateDTO dto)
        {
            // Gọi service để xử lý logic cập nhật
            var success = await _sceneService.UpdateSceneAsync(id, dto);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Cập nhật thất bại! Không tìm thấy ngữ cảnh hoặc dữ liệu không hợp lệ."
                });
            }

            return Ok(new { message = "Cập nhật ngữ cảnh thành công!" });
        }

        // 4. DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _sceneService.DeleteSceneAsync(id);
            if (!success) return NotFound("Không tìm thấy ngữ cảnh để xóa");
            return Ok(new { message = "Xóa ngữ cảnh thành công" });
        }
    }
}