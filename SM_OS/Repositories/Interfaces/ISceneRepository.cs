using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface ISceneRepository
    {
        Task<Scene> CreateSceneAsync(Scene scene);
        Task<Scene?> GetSceneByIdAsync(int id);
        Task<IEnumerable<Scene>> GetScenesByUserIdAsync(int userId);
    }
}