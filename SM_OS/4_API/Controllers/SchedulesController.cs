using Microsoft.AspNetCore.Mvc;
using SM_OS.Entities;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly ISchedulesService _schedulesService;

        public SchedulesController(ISchedulesService schedulesService)
        {
            _schedulesService = schedulesService;
        }

        // 1. POST 
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DeviceSchedule schedule)
        {
            var createdSchedule = await _schedulesService.CreateScheduleAsync(schedule);
            return CreatedAtAction(nameof(GetById), new { id = createdSchedule.Id }, createdSchedule);
        }


        // 2. GET 
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _schedulesService.GetAllSchedulesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _schedulesService.GetScheduleByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy lịch trình này." });

            return Ok(result);
        }


        // 3. PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DeviceSchedule schedule)
        {
            if (id != schedule.Id)
                return BadRequest(new { message = "ID không khớp." });

            await _schedulesService.UpdateScheduleAsync(schedule);
            return NoContent();
        }

        // 4. DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _schedulesService.DeleteScheduleAsync(id);
            return NoContent();
        }
    }
}