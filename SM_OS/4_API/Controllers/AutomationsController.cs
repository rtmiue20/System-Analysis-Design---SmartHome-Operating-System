using Microsoft.AspNetCore.Mvc;
using SM_OS.Entities;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutomationsController : ControllerBase
    {
        private readonly IAutomationsService _automationsService;
        public AutomationsController(IAutomationsService automationsService)
        {
            _automationsService = automationsService;
        }

        // 1. POST
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AutomationRule rule)
        {
            var createdRule = await _automationsService.CreateAutomationAsync(rule);
            return CreatedAtAction(nameof(GetById), new { id = createdRule.Id }, createdRule);
        }

        // 2. GET
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _automationsService.GetAllAutomationsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _automationsService.GetAutomationByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy quy tắc tự động hóa này." });

            return Ok(result);
        }

        // 3. PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AutomationRule rule)
        {
            if (id != rule.Id)
                return BadRequest(new { message = "ID trên URL không khớp với ID trong thân dữ liệu." });

            await _automationsService.UpdateAutomationAsync(rule);
            return NoContent();
        }

        // 4. DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _automationsService.DeleteAutomationAsync(id);
            return NoContent();
        }
    }
}