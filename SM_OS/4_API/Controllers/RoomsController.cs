using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Mappers;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        public RoomsController(IRoomService roomService) => _roomService = roomService;

        // 1. POST
        [HttpPost]
        public async Task<IActionResult> Create(RoomCreateDTO dto)
        {
            var room = await _roomService.AddRoomAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = room.RoomId }, room.ToResponseDto());
        }

        // 2. GET
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _roomService.GetAllRoomsAsync());

        // 3. PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoomCreateDTO dto)
        {
            var success = await _roomService.UpdateRoomAsync(id, dto);
            if (!success) return NotFound("This room cannot be found!");
            return Ok(new { message = "Room information updated successfully." });
        }

        // 4. DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _roomService.DeleteRoomAsync(id);
                if (!success) return NotFound("No rooms found to delete!");
                return Ok(new { message = "Room deleted successfully." });
            }
            catch (InvalidOperationException ex) 
            {
                return BadRequest(ex.Message);
            }
        }
    }
}