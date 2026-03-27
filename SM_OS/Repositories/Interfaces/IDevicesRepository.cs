using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface IDevicesRepository
    {
        // Lấy tất cả thiết bị kèm thông tin phòng
        Task<IEnumerable<SmartDevice>> GetAllAsync();

        // Lấy thiết bị theo ID
        Task<SmartDevice?> GetByIdAsync(int id);

        // Tạo thiết bị mới
        Task<SmartDevice> CreateAsync(SmartDevice device);

        // Cập nhật thiết bị
        Task<bool> UpdateAsync(SmartDevice device);

        // Xóa thiết bị
        Task<bool> DeleteAsync(int id);
    }
}