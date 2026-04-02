using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
/// <summary>
/* Lớp Scene đại diện cho một ngữ cảnh trong hệ thống, bao gồm các hành động liên quan đến một ngữ cảnh cụ thể
(ví dụ: "Đi ngủ", "Về nhà") mà người dùng có thể thiết lập để tự động hóa các thiết bị thông minh trong nhà.
*/
/// </summary>
public class Scene
{
	public Scene()
	{
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; // "Đi ngủ", "Về nhà"...

        public int UserId { get; set; } // Ngữ cảnh này của User nào

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        // Một ngữ cảnh gồm nhiều hành động (ví dụ: bật đèn 1, tắt quạt 2)
        public ICollection<SceneAction> SceneActions { get; set; } = new List<SceneAction>();   
    }
}
