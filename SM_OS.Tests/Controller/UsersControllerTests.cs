using Microsoft.AspNetCore.Mvc;
using Moq;
using SM_OS.Controllers;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Services.Interfaces;
using Xunit;

namespace SM_OS.Tests.Controllers
{
    public class UsersControllerTests
    {
        private readonly Mock<IUsersService> _mockUserService;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _mockUserService = new Mock<IUsersService>();
            _controller = new UsersController(_mockUserService.Object);
        }

        // --- TEST REGISTER ---
        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUsernameExists()
        {
            // Arrange
            var dto = new UserRegisterDTO { Username = "existing_user" };
            _mockUserService.Setup(s => s.RegisterAsync(dto)).ReturnsAsync((User?)null);

            // Act
            var result = await _controller.Register(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("The Username already exists!", badRequestResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnOk_WhenSuccess()
        {
            // Arrange
            var dto = new UserRegisterDTO { Username = "new_user" };
            var createdUser = new User { Username = "new_user", FullName = "New User" };
            _mockUserService.Setup(s => s.RegisterAsync(dto)).ReturnsAsync(createdUser);

            // Act
            var result = await _controller.Register(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value); // Đảm bảo trả về DTO
        }

        // --- TEST LOGIN ---
        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenCredentialsInvalid()
        {
            // Arrange
            var request = new LoginRequest { Username = "wrong_user", Password = "wrong_password" };
            _mockUserService.Setup(s => s.LoginAsync(request.Username, request.Password)).ReturnsAsync((User?)null);

            // Act
            var result = await _controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Incorrect account or password", unauthorizedResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnOkWithToken_WhenSuccess()
        {
            // Arrange
            var request = new LoginRequest { Username = "valid_user", Password = "valid_password" };
            var mockUser = new User { Username = "valid_user", Role = "HomeOwner" };
            string fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

            _mockUserService.Setup(s => s.LoginAsync(request.Username, request.Password)).ReturnsAsync(mockUser);
            _mockUserService.Setup(s => s.GenerateJwtToken(mockUser)).Returns(fakeToken);

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}