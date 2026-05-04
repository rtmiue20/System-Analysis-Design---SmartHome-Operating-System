using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Mappers
{
    public static class ScheduleMapper
    {
        public static DeviceSchedule ToEntity(this ScheduleCreateDTO dto)
        {
            return new DeviceSchedule
            {
                TriggerTime = dto.ExecutionTime,
                DaysOfWeek = dto.DaysOfWeek,
                TargetStatus = dto.ActionStatus,
                SmartDeviceId = dto.SmartDeviceId
            };
        }
    }
}