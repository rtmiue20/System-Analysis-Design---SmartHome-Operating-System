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
                // Bắt lỗi vi phạm khóa ngoại (UserId hoặc SmartDeviceId không tồn tại)
                // Trả về null để tầng Service/Controller biết đường báo lỗi 400 BadRequest
                return null;
            }
        }
        // BỔ SUNG: Cập nhật tên ngữ cảnh
        public async Task<bool> DeleteSceneAsync(Scene scene)
        {
            _context.Scenes.Remove(scene);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Scene?> GetSceneByIdAsync(int id) =>
            await _context.Scenes
                .Include(s => s.SceneActions)
                .AsNoTracking() // Tối ưu hóa: Báo cho EF Core không cần theo dõi cục data này
                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<IEnumerable<Scene>> GetScenesByUserIdAsync(int userId) =>
            await _context.Scenes
                .Include(s => s.SceneActions)
                .Where(s => s.UserId == userId)
                .AsNoTracking() // Tối ưu hóa hiệu năng cực tốt khi GET danh sách
                .ToListAsync();
    }

}