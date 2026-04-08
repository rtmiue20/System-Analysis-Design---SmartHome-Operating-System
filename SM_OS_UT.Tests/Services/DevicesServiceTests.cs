using Microsoft.Extensions.Logging;
using Moq;
using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using Xunit;

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

        // TEST CASE 3: AddDevice thất bại do RoomId không tồn tại
        [Fact]
        public async Task AddDeviceAsync_ShouldReturnNull_WhenRoomNotFound()
        {
            // Arrange
            var dto = new DeviceCreateDTO { RoomId = 99 };
            // Giả lập kho lưu trữ phòng trả về null (không thấy phòng)
            _mockRoomRepo.Setup(repo => repo.GetByIdAsync(dto.RoomId)).ReturnsAsync((Room?)null);

            // Act
            var result = await _devicesService.AddDeviceAsync(dto);

            // Assert
            Assert.Null(result); // Đảm bảo Service trả về null như logic đã viết
        }

        // TEST CASE 4: AddDevice thành công
        [Fact]
        public async Task AddDeviceAsync_ShouldReturnDevice_WhenRoomExists()
        {
            // Arrange
            var dto = new DeviceCreateDTO { RoomId = 1, Name = "Quạt" };
            var mockRoom = new Room { RoomId = 1, RoomName = "Phòng khách" };

            _mockRoomRepo.Setup(repo => repo.GetByIdAsync(dto.RoomId)).ReturnsAsync(mockRoom);

            // Setup Repo tạo mới thiết bị và trả về thực thể đó
            _mockDeviceRepo.Setup(repo => repo.CreateAsync(It.IsAny<SmartDevice>()))
                           .ReturnsAsync((SmartDevice device) => device);

            // Act
            var result = await _devicesService.AddDeviceAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.RoomId, result.RoomId);
        }
    }
}