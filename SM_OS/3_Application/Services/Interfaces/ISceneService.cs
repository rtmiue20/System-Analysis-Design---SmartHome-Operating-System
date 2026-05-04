using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface ISceneService
    {
        Task<Scene?> AddSceneAsync(SceneCreateDTO dto);
        Task<IEnumerable<Scene>> GetUserScenesAsync(int userId);
        Task<IEnumerable<Scene>> GetAllScenesAsync();
        Task<bool> UpdateSceneAsync(int id, SceneCreateDTO dto);
        Task<bool> DeleteSceneAsync(int id);
        Task<bool> ExecuteSceneAsync(int sceneId, string userName);


    }
}