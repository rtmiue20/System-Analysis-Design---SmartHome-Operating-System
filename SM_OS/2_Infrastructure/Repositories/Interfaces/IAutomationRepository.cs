using SM_OS.Entities;

namespace SM_OS.Repositories.Interfaces
{
    public interface IAutomationRepository
    {
        Task<AutomationRule> CreateAsync(AutomationRule rule);
        Task<IEnumerable<AutomationRule>> GetAllAsync();
        Task<AutomationRule?> GetByIdAsync(int id);
        Task UpdateAsync(AutomationRule rule);
        Task DeleteAsync(int id);
    }
}