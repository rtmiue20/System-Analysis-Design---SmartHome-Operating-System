using Moq;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using Xunit;

namespace SM_OS.Tests.Services
{
    public class RoomServiceTests
    {
        private readonly Mock<IRoomRepository> _mockRoomRepo;
        private readonly RoomService _roomService;

        public RoomServiceTests()
        {
            _mockRoomRepo = new Mock<IRoomRepository>();
            // Tiêm Mock Repository vào Service
            _roomService = new RoomService(_mockRoomRepo.Object);
        }

        // TEST HÀM: DeleteRoomAsync

        [Fact]
        public async Task DeleteRoomAsync_ShouldReturnFalse_WhenRoomDoesNotExist()
        {
            // Arrange: Giả lập DB không tìm thấy phòng (trả về null)
            int roomId = 99;
            _mockRoomRepo.Setup(r => r.GetByIdAsync(roomId)).ReturnsAsync((Room?)null);

            // Act: Gọi hàm xóa
            var result = await _roomService.DeleteRoomAsync(roomId);

            // Assert: Trả về false và hàm DeleteAsync của DB tuyệt đối KHÔNG ĐƯỢC GỌI
            Assert.False(result);
            _mockRoomRepo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task DeleteRoomAsync_ShouldThrowException_WhenRoomHasDevices()
        {
            // Arrange: Giả lập tìm thấy phòng, nhưng trong phòng ĐANG CÓ THIẾT BỊ
            int roomId = 1;
            var roomWithDevices = new Room
            {
                RoomId = roomId,
                RoomName = "Living Room",
                SmartDevices = new List<SmartDevice>
                {
                    new SmartDevice { DeviceId = 101, Name = "Smart TV" }
                }
            };

            _mockRoomRepo.Setup(r => r.GetByIdAsync(roomId)).ReturnsAsync(roomWithDevices);

            // Act & Assert: Phải bắt được lỗi InvalidOperationException văng ra
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _roomService.DeleteRoomAsync(roomId));

            // So sánh xem câu thông báo lỗi có khớp 100% không
            Assert.Equal("The room cannot be deleted because there is still equipment inside!", exception.Message);

            // Đảm bảo tuyệt đối lệnh xóa dưới DB không được gọi để bảo toàn dữ liệu
            _mockRoomRepo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task DeleteRoomAsync_ShouldReturnTrue_WhenRoomIsEmptyAndDeletedSuccessfully()
        {
            // Arrange: Giả lập phòng trống (List SmartDevices rỗng)
            int roomId = 2;
            var emptyRoom = new Room
            {
                RoomId = roomId,
                RoomName = "Empty Bedroom",
                SmartDevices = new List<SmartDevice>() // Không có thiết bị nào
            };

            _mockRoomRepo.Setup(r => r.GetByIdAsync(roomId)).ReturnsAsync(emptyRoom);
            _mockRoomRepo.Setup(r => r.DeleteAsync(roomId)).ReturnsAsync(true); // DB xóa thành công

            // Act
            var result = await _roomService.DeleteRoomAsync(roomId);

            // Assert
            Assert.True(result);
            _mockRoomRepo.Verify(r => r.DeleteAsync(roomId), Times.Once); // Đảm bảo gọi DB đúng 1 lần
        }
    }
}