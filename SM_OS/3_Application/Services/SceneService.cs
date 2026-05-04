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

        // 1. C - Create
        public async Task<Scene?> AddSceneAsync(SceneCreateDTO dto)
        {
            foreach (var action in dto.Actions)
            {
                var dev = await _deviceRepo.GetByIdAsync(action.SmartDeviceId);
                if (dev == null) return null; 
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

        // 2. R - Read
        public async Task<IEnumerable<Scene>> GetAllScenesAsync() => await _sceneRepo.GetAllScenesAsync();

        public async Task<IEnumerable<Scene>> GetUserScenesAsync(int userId) => await _sceneRepo.GetScenesByUserIdAsync(userId);

        public async Task<Scene?> GetSceneByIdAsync(int id) => await _sceneRepo.GetSceneByIdAsync(id);

        // 3. U - Update
        public async Task<bool> UpdateSceneAsync(int id, SceneCreateDTO dto)
        {
            var existingScene = await _sceneRepo.GetSceneByIdAsync(id);
            if (existingScene == null) return false;

            existingScene.Name = dto.Name;

            existingScene.SceneActions = dto.Actions.Select(a => new SceneAction
            {
                SmartDeviceId = a.SmartDeviceId,
                TargetStatus = a.TargetStatus
            }).ToList();

            return await _sceneRepo.UpdateSceneAsync(existingScene);
        }

        // 4. D - Delete    
        public async Task<bool> DeleteSceneAsync(int id)
        {
            var scene = await _sceneRepo.GetSceneByIdAsync(id);
            if (scene == null) return false;
            return await _sceneRepo.DeleteSceneAsync(scene); 
        }


        // Hàm thực thi ngữ cảnh: Dựa vào SceneId, lấy ra danh sách hành động và gọi DeviceService để cập nhật trạng thái thiết bị
        public async Task<bool> ExecuteSceneAsync(int sceneId, string userName) 
        {
            var scene = await _sceneRepo.GetSceneByIdAsync(sceneId);
            if (scene == null) return false;

            foreach (var action in scene.SceneActions)
            {
                await _deviceService.UpdateStatusAsync(action.SmartDeviceId, action.TargetStatus, userName);
            }
            return true;
        }
    }
}