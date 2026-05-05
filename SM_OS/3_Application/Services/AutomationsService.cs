using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;
using SM_OS.Services.Interfaces;

namespace SM_OS.Services
{
    public class AutomationsService : IAutomationsService
    {
        private readonly IAutomationRepository _automationRepository;
        public AutomationsService(IAutomationRepository automationRepository)
        {
            _automationRepository = automationRepository;
        }

        // 1. C - Create
        public async Task<AutomationRule> CreateAutomationAsync(AutomationRule rule)
        {
            return await _automationRepository.CreateAsync(rule);
        }

        // 2. R - Read
        public async Task<IEnumerable<AutomationRule>> GetAllAutomationsAsync()
        {
            return await _automationRepository.GetAllAsync();
        }

        public async Task<AutomationRule?> GetAutomationByIdAsync(int id)
        {
            return await _automationRepository.GetByIdAsync(id);
        }

        // 3. U - Update
        public async Task UpdateAutomationAsync(AutomationRule rule)
        {
            await _automationRepository.UpdateAsync(rule);
        }

        // 4. D - Delete
        public async Task DeleteAutomationAsync(int id)
        {
            await _automationRepository.DeleteAsync(id);
        }
    }
}