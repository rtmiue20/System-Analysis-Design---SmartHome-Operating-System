using Moq;
using Xunit;
using Microsoft.Extensions.Logging;
using SM_OS.Services;
using SM_OS.Repositories.Interfaces;
using SM_OS.Entities;

namespace SM_OS.Tests.Services
{
    public class DevicesServiceTests
    {
        // 1. Khai báo Mock cho TẤT CẢ các dependency mà DevicesService cần
        private readonly Mock<IDevicesRepository> _mockDeviceRepo;
        private readonly Mock<IRoomRepository> _mockRoomRepo;
        private readonly Mock<ILogger<DevicesService>> _mockLogger;

        private readonly DevicesService _devicesService;

        public DevicesServiceTests()
        {
            // Khởi tạo các đối tượng Mock
            _mockDeviceRepo = new Mock<IDevicesRepository>();
            _mockRoomRepo = new Mock<IRoomRepository>();
            _mockLogger = new Mock<ILogger<DevicesService>>();

            // 2. Tiêm đủ 3 tham số vào Service (Sửa lỗi gạch đỏ CS7036)
            _devicesService = new DevicesService(
                _mockDeviceRepo.Object,
                _mockRoomRepo.Object,
                _mockLogger.Object
            );
        }

        // TEST CASE 1: Cập nhật thành công
        [Fact]
        public async Task UpdateStatusAsync_ShouldReturnTrue_WhenUpdateIsSuccessful()
        {
            // Arrange
            int deviceId = 1;
            string status = "On";
            string userName = "test_user";

            // Tạo một thiết bị giả để Repo trả về
            var mockDevice = new SmartDevice { DeviceId = deviceId, Status = "Off" };

            // Giả lập bước 1: Repo tìm thấy thiết bị
            _mockDeviceRepo.Setup(repo => repo.GetByIdAsync(deviceId))
                           .ReturnsAsync(mockDevice);

            // Giả lập bước 2: Repo cập nhật thành công trả về true
            _mockDeviceRepo.Setup(repo => repo.UpdateAsync(It.IsAny<SmartDevice>()))
                           .ReturnsAsync(true);

            // Act
            var result = await _devicesService.UpdateStatusAsync(deviceId, status, userName);

            // Assert
            Assert.True(result);
        }

        // TEST CASE 2: Cập nhật thất bại do không tìm thấy thiết bị
        [Fact]
        public async Task UpdateStatusAsync_ShouldReturnFalse_WhenDeviceNotFound()
        {
            // Arrange
            int deviceId = 999; // ID không tồn tại
            string status = "On";
            string userName = "test_user";

            // Giả lập: Repo trả về null (không tìm thấy)
            _mockDeviceRepo.Setup(repo => repo.GetByIdAsync(deviceId))
                           .ReturnsAsync((SmartDevice?)null);

            // Act 
            var result = await _devicesService.UpdateStatusAsync(deviceId, status, userName);

            // Assert 
            Assert.False(result);
        }
    }
}