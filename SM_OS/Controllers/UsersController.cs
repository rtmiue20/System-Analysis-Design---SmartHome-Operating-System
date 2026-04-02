using Microsoft.AspNetCore.Mvc;
using SM_OS.DTOs;
using SM_OS.Mappers;
using SM_OS.Services.Interfaces;

namespace SM_OS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _userService;
        public UsersController(IUsersService userService) => _userService = userService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO dto)
        {
            var user = await _userService.RegisterAsync(dto);
            if (user == null) return BadRequest("Username đã tồn tại!");
            return Ok(user.ToResponseDto());
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.LoginAsync(request.Username, request.Password);
            if (user == null) return Unauthorized("Sai tài khoản hoặc mật khẩu");
            var token = _userService.GenerateJwtToken(user);
            return Ok(new
            {
                message = "Đăng nhập thành công",
                token = token,
                user = user.ToResponseDto()
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}