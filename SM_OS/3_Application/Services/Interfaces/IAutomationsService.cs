using SM_OS.Entities;

namespace SM_OS.Services.Interfaces
{
    public interface IAutomationsService
    {
        Task<AutomationRule> CreateAutomationAsync(AutomationRule rule);
        Task<IEnumerable<AutomationRule>> GetAllAutomationsAsync();
        Task<AutomationRule?> GetAutomationByIdAsync(int id);
        Task UpdateAutomationAsync(AutomationRule rule);
        Task DeleteAutomationAsync(int id);
    }
}