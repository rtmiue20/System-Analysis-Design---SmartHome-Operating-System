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

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _roomService.GetAllRoomsAsync());

        [HttpPost]
        public async Task<IActionResult> Create(RoomCreateDTO dto)
        {
            var room = await _roomService.AddRoomAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = room.RoomId }, room.ToResponseDto());
        }
    }
}