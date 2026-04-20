using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface IRoomRepository
    {
        // Lấy tất cả phòng kèm thiết bị
        Task<IEnumerable<Room>> GetAllAsync();

        // Lấy phòng theo ID kèm thiết bị
        Task<Room?> GetByIdAsync(int id);

        // Tạo phòng mới
        Task<Room> CreateAsync(Room room);

        // Cập nhật phòng
        Task<bool> UpdateAsync(Room room);

        // Xóa phòng theo ID
        Task<bool> DeleteAsync(int id);
    }
}