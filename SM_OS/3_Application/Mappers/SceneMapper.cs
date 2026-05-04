using SM_OS.DTOs;
using SM_OS.Entities;

namespace SM_OS.Mappers
{
    public static class SceneMapper
    {
        // Chuyển từ DTO sang Entity để lưu DB
        public static Scene ToEntity(this SceneCreateDTO dto)
        {
            return new Scene
            {
                Name = dto.Name,
                UserId = dto.UserId,
                SceneActions = dto.Actions.Select(a => new SceneAction
                {
                    SmartDeviceId = a.SmartDeviceId,
                    TargetStatus = a.TargetStatus
                }).ToList()
            };
        }

        public static object ToResponseDto(this Scene scene)
        {
            return new
            {
                scene.Id,
                scene.Name,
                scene.UserId,
                Actions = scene.SceneActions.Select(a => new
                {
                    a.SmartDeviceId,
                    DeviceName = a.SmartDevice?.Name ?? "Unknown", 
                    a.TargetStatus
                })
            };
        }
    }
}