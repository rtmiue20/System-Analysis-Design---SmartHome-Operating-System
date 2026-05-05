using Microsoft.EntityFrameworkCore;
using SM_OS.Data;
using SM_OS.Entities;
using SM_OS.Repositories.Interfaces;

namespace SM_OS.Repositories
{
    public class AutomationRepository : IAutomationRepository
    {
        private readonly ApplicationDbContext _context;

        public AutomationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. C - Create
        public async Task<AutomationRule> CreateAsync(AutomationRule rule)
        {
            _context.AutomationRules.Add(rule);
            await _context.SaveChangesAsync();
            return rule;
        }

        // 2. R - Read
        public async Task<IEnumerable<AutomationRule>> GetAllAsync()
        {
            return await _context.AutomationRules
                .Include(a => a.SensorDevice)
                .Include(a => a.ActionDevice)
                .ToListAsync();
        }

        public async Task<AutomationRule?> GetByIdAsync(int id)
        {
            return await _context.AutomationRules
                .Include(a => a.SensorDevice)
                .Include(a => a.ActionDevice)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        // 3. U - Update
        public async Task UpdateAsync(AutomationRule rule)
        {
            _context.AutomationRules.Update(rule);
            await _context.SaveChangesAsync();
        }

        // 4. D - Delete
        public async Task DeleteAsync(int id)
        {
            var rule = await _context.AutomationRules.FindAsync(id);
            if (rule != null)
            {
                _context.AutomationRules.Remove(rule);
                await _context.SaveChangesAsync();
            }
        }
    }
}