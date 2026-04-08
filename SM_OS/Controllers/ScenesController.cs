using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScenesController : ControllerBase
    {
        private readonly ISceneService _sceneService;

        public ScenesController(ISceneService sceneService)
        {
            _sceneService = sceneService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(SceneCreateDTO dto)
        {
            var scene = await _sceneService.AddSceneAsync(dto);

            if (scene == null)
                return BadRequest("Tạo ngữ cảnh thất bại! Vui lòng kiểm tra lại UserId hoặc SmartDeviceId.");

            return Ok(new { message = "Context created successfully!", sceneId = scene.Id });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserScenes(int userId)
        {
            var scenes = await _sceneService.GetUserScenesAsync(userId);
            return Ok(scenes);
        }

        [HttpPost("{id}/execute")]
        public async Task<IActionResult> Execute(int id)
        {
            var userName = User.Identity?.Name ?? "Automation System";
            var success = await _sceneService.ExecuteSceneAsync(id, userName);

            if (!success) return NotFound("This context was not found!");

            return Ok(new { message = $"Context ID has been successfully activated: {id}" });
        }
    }
}