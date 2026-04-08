using SM_OS.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// Lớp SceneAction đại diện cho một hành động cụ thể trong một ngữ cảnh (Scene),
/// liên kết với một thiết bị thông minh cụ thể và trạng thái mong muốn của thiết bị đó khi ngữ cảnh được kích hoạt.
/// </summary>
namespace SM_OS.Entities;
public class SceneAction
{

        [Key]
        public int Id { get; set; }

        [Required]
        public string TargetStatus { get; set; } = string.Empty; // "On", "Off", "70%"...

        public int SceneId { get; set; }
        [ForeignKey("SceneId")]
        public Scene Scene { get; set; } = null!;

        public int SmartDeviceId { get; set; }
        [ForeignKey("SmartDeviceId")]
        public SmartDevice SmartDevice { get; set; } = null!;
    
}
