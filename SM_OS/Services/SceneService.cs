using SM_OS.DTOs;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class SceneService : ISceneService
    {
        private readonly ISceneRepository _sceneRepo;
        private readonly IDevicesService _deviceService;

        public SceneService(ISceneRepository sceneRepo, IDevicesService deviceService)
        {
            _sceneRepo = sceneRepo;
            _deviceService = deviceService; // Tái sử dụng service của Device
        }

        public async Task<Scene?> AddSceneAsync(SceneCreateDTO dto)
        {
            var scene = new Scene
            {
                Name = dto.Name,
                UserId = dto.UserId,
                SceneActions = dto.Actions.Select(a => new SceneAction
                {
                    SmartDeviceId = a.SmartDeviceId,
                    TargetStatus = a.TargetStatus
                }).ToList()
            };
            return await _sceneRepo.CreateSceneAsync(scene);
        }

        public async Task<IEnumerable<Scene>> GetUserScenesAsync(int userId) =>
            await _sceneRepo.GetScenesByUserIdAsync(userId);

        public async Task<bool> ExecuteSceneAsync(int sceneId, string userName)
        {
            var scene = await _sceneRepo.GetSceneByIdAsync(sceneId);
            if (scene == null) return false;

            // Duyệt qua từng hành động trong ngữ cảnh và yêu cầu DeviceService cập nhật
            foreach (var action in scene.SceneActions)
            {
                // Hành động này sẽ tự động ghi log và bắn SignalR sang Frontend (đã cấu hình ở Phase 1)
                await _deviceService.UpdateStatusAsync(action.SmartDeviceId, action.TargetStatus, userName);
            }

            return true;
        }
    }
}