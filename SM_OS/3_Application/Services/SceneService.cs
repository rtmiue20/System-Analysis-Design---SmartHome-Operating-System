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
        private readonly IDevicesRepository _deviceRepo;

        public SceneService(ISceneRepository sceneRepo, IDevicesService deviceService, IDevicesRepository deviceRepo)
        {
            _sceneRepo = sceneRepo;
            _deviceService = deviceService;
            _deviceRepo = deviceRepo;
        }

        public async Task<Scene?> AddSceneAsync(SceneCreateDTO dto)
        {
            // VALIDATE: Kiểm tra tất cả thiết bị trong danh sách hành động có tồn tại không
            foreach (var action in dto.Actions)
            {
                var dev = await _deviceRepo.GetByIdAsync(action.SmartDeviceId);
                if (dev == null) return null; // Trả về null nếu có thiết bị không tồn tại
            }

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

        //public async Task<bool> ExecuteSceneAsync(int sceneId, string userName)
        //{
        //    var scene = await _sceneRepo.GetSceneByIdAsync(sceneId);
        //    if (scene == null) return false;

        //    // Duyệt qua từng hành động trong ngữ cảnh và yêu cầu DeviceService cập nhật
        //    foreach (var action in scene.SceneActions)
        //    {
        //        // Hành động này sẽ tự động ghi log và bắn SignalR sang Frontend (đã cấu hình ở Phase 1)
        //        await _deviceService.UpdateStatusAsync(action.SmartDeviceId, action.TargetStatus, userName);
        //    }

        //    return true;
        //}

        public async Task<bool> DeleteSceneAsync(int id)
        {
            var scene = await _sceneRepo.GetSceneByIdAsync(id);
            if (scene == null) return false;
            return await _sceneRepo.DeleteSceneAsync(scene); // Giả định Repo đã có hàm Delete
        }

        public async Task<bool> ExecuteSceneAsync(int sceneId, string userName)
        {
            var scene = await _sceneRepo.GetSceneByIdAsync(sceneId);
            if (scene == null) return false;

            foreach (var action in scene.SceneActions)
            {
                // Cập nhật trạng thái thiết bị theo hành động trong ngữ cảnh
                await _deviceService.UpdateStatusAsync(action.SmartDeviceId, action.TargetStatus, userName);
            }
            return true;
        }
    }
}