using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface ISceneService
    {
        Task<Scene?> AddSceneAsync(SceneCreateDTO dto);
        Task<IEnumerable<Scene>> GetUserScenesAsync(int userId);
        Task<bool> ExecuteSceneAsync(int sceneId, string userName); // Hàm thực thi ngữ cảnh
        Task<bool> DeleteSceneAsync(int id);
        Task<IEnumerable<Scene>> GetAllScenesAsync();
    }
}