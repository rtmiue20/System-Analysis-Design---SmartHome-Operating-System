using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;
using SM_OS.Controllers;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Hubs;
using SM_OS.Hubs.Interface;
using SM_OS.Services.Interfaces;
using System.Security.Claims;
using Xunit;

namespace SM_OS.Tests.Controllers
{
    public class DevicesControllerTests
    {
        private readonly Mock<IDevicesService> _mockDeviceService;
        private readonly Mock<IHubContext<SmartHomeHub, ISmartHomeClient>> _mockHubContext;
        private readonly Mock<IHubClients<ISmartHomeClient>> _mockHubClients;
        private readonly Mock<ISmartHomeClient> _mockSmartHomeClient;
        private readonly DevicesController _controller;

        public DevicesControllerTests()
        {
            _mockDeviceService = new Mock<IDevicesService>();

            // Setup Mock cho SignalR (HubContext -> Clients -> All -> ISmartHomeClient)
            _mockHubContext = new Mock<IHubContext<SmartHomeHub, ISmartHomeClient>>();
            _mockHubClients = new Mock<IHubClients<ISmartHomeClient>>();
            _mockSmartHomeClient = new Mock<ISmartHomeClient>();

            _mockHubClients.Setup(clients => clients.All).Returns(_mockSmartHomeClient.Object);
            _mockHubContext.Setup(hub => hub.Clients).Returns(_mockHubClients.Object);

            _controller = new DevicesController(_mockDeviceService.Object, _mockHubContext.Object);

            // Giả lập (Mock) User đang đăng nhập để lấy được User.Identity.Name
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, "test_user")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        // --- TEST API CREATE ---
        [Fact]
        public async Task Create_ShouldReturnBadRequest_WhenRoomDoesNotExist()
        {
            // Arrange
            var dto = new DeviceCreateDTO { RoomId = 99 };
            _mockDeviceService.Setup(s => s.AddDeviceAsync(dto)).ReturnsAsync((SmartDevice?)null);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("RoomId does not exist!", badRequestResult.Value);
        }

        [Fact]
        public async Task Create_ShouldReturnOkWithDto_WhenSuccess()
        {
            // Arrange
            var dto = new DeviceCreateDTO { RoomId = 1, Name = "Led" };
            var createdDevice = new SmartDevice { DeviceId = 1, RoomId = 1, Name = "Led" };
            _mockDeviceService.Setup(s => s.AddDeviceAsync(dto)).ReturnsAsync(createdDevice);

            // Act
            var result = await _controller.Create(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value); // Đảm bảo trả về DTO
        }

        // --- TEST API UPDATE STATUS ---
        [Fact]
        public async Task UpdateStatus_ShouldReturnNotFound_WhenUpdateFails()
        {
            // Arrange
            int deviceId = 99;
            string status = "On";
            _mockDeviceService.Setup(s => s.UpdateStatusAsync(deviceId, status, "test_user"))
                              .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateStatus(deviceId, status);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task UpdateStatus_ShouldReturnOkAndTriggerSignalR_WhenUpdateSucceeds()
        {
            // Arrange
            int deviceId = 1;
            string status = "On";
            _mockDeviceService.Setup(s => s.UpdateStatusAsync(deviceId, status, "test_user"))
                              .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateStatus(deviceId, status);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Status update successful", okResult.Value);

            // Kiểm tra xem Hub SignalR có được gọi đúng hàm ReceiveDeviceUpdate hay không
            _mockSmartHomeClient.Verify(
                client => client.ReceiveDeviceUpdate(deviceId, true),
                Times.Once); // Xác nhận hàm này được chạy đúng 1 lần
        }
    }
}