using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SM_OS.Controllers;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Services.Interfaces;
using System.Security.Claims;
using Xunit;

namespace SM_OS.Tests.Controllers
{
    public class ScenesControllerTests
    {
        private readonly Mock<ISceneService> _mockSceneService;
        private readonly ScenesController _controller;

        public ScenesControllerTests()
        {
            _mockSceneService = new Mock<ISceneService>();
            _controller = new ScenesController(_mockSceneService.Object);

            // Giả lập User đăng nhập cho hàm Execute
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, "test_user")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        // --- TEST CREATE ---
        [Fact]
        public async Task Create_ShouldReturnBadRequest_WhenServiceReturnsNull()
        {
            // Arrange
            var dto = new SceneCreateDTO { Name = "Night Mode" };
            _mockSceneService.Setup(s => s.AddSceneAsync(dto)).ReturnsAsync((Scene?)null);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Tạo ngữ cảnh thất bại! Vui lòng kiểm tra lại UserId hoặc SmartDeviceId.", badRequestResult.Value);
        }

        [Fact]
        public async Task Create_ShouldReturnOk_WhenSuccess()
        {
            // Arrange
            var dto = new SceneCreateDTO { Name = "Night Mode" };
            var createdScene = new Scene { Id = 1, Name = "Night Mode" };
            _mockSceneService.Setup(s => s.AddSceneAsync(dto)).ReturnsAsync(createdScene);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        // --- TEST GET USER SCENES ---
        [Fact]
        public async Task GetUserScenes_ShouldReturnOk_WithScenes()
        {
            // Arrange
            int userId = 1;
            var scenes = new List<Scene> { new Scene { Id = 1, Name = "Morning Mode" } };
            _mockSceneService.Setup(s => s.GetUserScenesAsync(userId)).ReturnsAsync(scenes);

            // Act
            var result = await _controller.GetUserScenes(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        // --- TEST EXECUTE ---
        [Fact]
        public async Task Execute_ShouldReturnNotFound_WhenSceneDoesNotExist()
        {
            // Arrange
            int sceneId = 99;
            _mockSceneService.Setup(s => s.ExecuteSceneAsync(sceneId, "test_user")).ReturnsAsync(false);

            // Act
            var result = await _controller.Execute(sceneId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("This context was not found!", notFoundResult.Value);
        }

        [Fact]
        public async Task Execute_ShouldReturnOk_WhenSuccess()
        {
            // Arrange
            int sceneId = 1;
            _mockSceneService.Setup(s => s.ExecuteSceneAsync(sceneId, "test_user")).ReturnsAsync(true);

            // Act
            var result = await _controller.Execute(sceneId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}