using Microsoft.AspNetCore.Mvc;
using Moq;
using SM_OS.Controllers;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Services.Interfaces;
using Xunit;

namespace SM_OS.Tests.Controllers
{
    public class RoomsControllerTests
    {
        private readonly Mock<IRoomService> _mockRoomService;
        private readonly RoomsController _controller;

        public RoomsControllerTests()
        {
            _mockRoomService = new Mock<IRoomService>();
            _controller = new RoomsController(_mockRoomService.Object);
        }

        // --- TEST GET ALL ---
        [Fact]
        public async Task GetAll_ShouldReturnOk_WithRoomsList()
        {
            // Arrange
            var rooms = new List<Room> { new Room { RoomId = 1, RoomName = "Living Room" } };
            _mockRoomService.Setup(s => s.GetAllRoomsAsync()).ReturnsAsync(rooms);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        // --- TEST CREATE ---
        [Fact]
        public async Task Create_ShouldReturnCreatedAtAction_WhenSuccess()
        {
            // Arrange
            var dto = new RoomCreateDTO { Name = "Kitchen" };
            var createdRoom = new Room { RoomId = 2, RoomName = "Kitchen" };
            _mockRoomService.Setup(s => s.AddRoomAsync(dto)).ReturnsAsync(createdRoom);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetAll", createdAtActionResult.ActionName);
            Assert.NotNull(createdAtActionResult.Value); // Đảm bảo trả về DTO
        }

        // --- TEST UPDATE ---
        [Fact]
        public async Task Update_ShouldReturnNotFound_WhenRoomDoesNotExist()
        {
            // Arrange
            int roomId = 99;
            var dto = new RoomCreateDTO { Name = "Updated Room" };
            _mockRoomService.Setup(s => s.UpdateRoomAsync(roomId, dto)).ReturnsAsync(false);

            // Act
            var result = await _controller.Update(roomId, dto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("This room cannot be found!", notFoundResult.Value);
        }

        [Fact]
        public async Task Update_ShouldReturnOk_WhenSuccess()
        {
            // Arrange
            int roomId = 1;
            var dto = new RoomCreateDTO { Name = "Updated Room" };
            _mockRoomService.Setup(s => s.UpdateRoomAsync(roomId, dto)).ReturnsAsync(true);

            // Act
            var result = await _controller.Update(roomId, dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            // Có thể dùng reflection hoặc dynamic để check message nếu cần
            Assert.NotNull(okResult.Value);
        }

        // --- TEST DELETE ---
        [Fact]
        public async Task Delete_ShouldReturnBadRequest_WhenRoomHasDevices()
        {
            // Arrange
            int roomId = 1;
            var exceptionMessage = "The room cannot be deleted because there is still equipment inside!";
            // Giả lập Service quăng lỗi
            _mockRoomService.Setup(s => s.DeleteRoomAsync(roomId))
                            .ThrowsAsync(new InvalidOperationException(exceptionMessage));

            // Act
            var result = await _controller.Delete(roomId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(exceptionMessage, badRequestResult.Value);
        }

        [Fact]
        public async Task Delete_ShouldReturnNotFound_WhenRoomDoesNotExist()
        {
            // Arrange
            int roomId = 99;
            _mockRoomService.Setup(s => s.DeleteRoomAsync(roomId)).ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(roomId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("No rooms found to delete!", notFoundResult.Value);
        }

        [Fact]
        public async Task Delete_ShouldReturnOk_WhenSuccess()
        {
            // Arrange
            int roomId = 1;
            _mockRoomService.Setup(s => s.DeleteRoomAsync(roomId)).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(roomId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}