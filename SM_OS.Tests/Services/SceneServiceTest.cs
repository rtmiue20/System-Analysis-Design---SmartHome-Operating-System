using Moq;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services;
using SM_OS.Services.Interfaces;
using Xunit;

namespace SM_OS.Tests.Services
{
    public class SceneServiceTests
    {
        private readonly Mock<ISceneRepository> _mockSceneRepo;
        private readonly Mock<IDevicesService> _mockDeviceService;
        private readonly SceneService _sceneService;

        public SceneServiceTests()
        {
            _mockSceneRepo = new Mock<ISceneRepository>();
            _mockDeviceService = new Mock<IDevicesService>();
            // truyền 2 Mock này vào Service 
            _sceneService = new SceneService(_mockSceneRepo.Object, _mockDeviceService.Object);
        }

        [Fact]
        public async Task ExecuteSceneAsync_ShouldReturnFalse_WhenSceneNotFound()
        {
            // đưa vào ID 99 (không có trong DB)
            int sceneId = 99;
            _mockSceneRepo.Setup(r => r.GetSceneByIdAsync(sceneId)).ReturnsAsync((Scene?)null);

            var result = await _sceneService.ExecuteSceneAsync(sceneId, "test_user");

            // Assert: Phải báo false
            Assert.False(result);
            // Hàm Update thiết bị không được gọi (Times.Never)
            _mockDeviceService.Verify(s => s.UpdateStatusAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ExecuteSceneAsync_ShouldReturnTrue_And_UpdateAllDevices_WhenSceneExists()
        {
            // Giả lập tìm thấy kịch bản có chứa 2 hành động
            int sceneId = 1;
            var userName = "duyen_ngo";
            var mockScene = new Scene
            {
                Id = sceneId,
                SceneActions = new List<SceneAction>
                {
                    new SceneAction { SmartDeviceId = 10, TargetStatus = "On" }, // Tb 1
                    new SceneAction { SmartDeviceId = 11, TargetStatus = "Off" } // Tb 2
                }
            };

            _mockSceneRepo.Setup(r => r.GetSceneByIdAsync(sceneId)).ReturnsAsync(mockScene);

            // giả lập DeviceService luôn chạy thành công
            _mockDeviceService.Setup(s => s.UpdateStatusAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>()))
                              .ReturnsAsync(true);

            // Act: Chạy hàm
            var result = await _sceneService.ExecuteSceneAsync(sceneId, userName);

            // Assert: Phải báo true
            Assert.True(result);

            // Kiểm tra xem Service có thực sự gửi lệnh Update đi ĐÚNG 2 LẦN cho 2 cái ID kia không
            _mockDeviceService.Verify(s => s.UpdateStatusAsync(10, "On", userName), Times.Once);
            _mockDeviceService.Verify(s => s.UpdateStatusAsync(11, "Off", userName), Times.Once);
        }
    }
}