using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Repositories.Interfaces;
using SM_OS.Entities;

namespace SM_OS.Repositories
{
    public class SceneRepository : ISceneRepository
    {
        private readonly ApplicationDbContext _context;
        public SceneRepository(ApplicationDbContext context) => _context = context;

        // 1. C - Create
        public async Task<Scene?> CreateSceneAsync(Scene scene)
        {
            try
            {
                await _context.Scenes.AddAsync(scene);
                await _context.SaveChangesAsync();
                return scene;
            }
            catch (DbUpdateException)
            {
                return null;
            }
        }

        // 2. R - Read
        public async Task<Scene?> GetSceneByIdAsync(int id) =>
            await _context.Scenes
                .Include(s => s.SceneActions)
                .AsNoTracking() 
                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<IEnumerable<Scene>> GetAllScenesAsync() =>
            await _context.Scenes
                .Include(s => s.SceneActions)
                .AsNoTracking()
                .ToListAsync();

        public async Task<IEnumerable<Scene>> GetScenesByUserIdAsync(int userId) =>
            await _context.Scenes
                .Include(s => s.SceneActions)
                .Where(s => s.UserId == userId)
                .AsNoTracking()
                .ToListAsync();

        // 3. U - Update
        public async Task<bool> UpdateSceneAsync(Scene scene)
        {
            _context.Scenes.Update(scene);
            return await _context.SaveChangesAsync() > 0;
        }

        // 4. D - Delete
        public async Task<bool> DeleteSceneAsync(Scene scene)
        {
            _context.Scenes.Remove(scene);
            return await _context.SaveChangesAsync() > 0;
        }

    }

}