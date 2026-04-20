namespace SM_OS.DTOs
{
	public class SceneCreateDTO
	{
		public string Name { get; set; } = string.Empty;
		public int UserId { get; set; } 
		public List<SceneActionDTO> Actions { get; set; } = new List<SceneActionDTO>();
	}

	public class SceneActionDTO
	{
		public int SmartDeviceId { get; set; }
		public string TargetStatus { get; set; } = string.Empty;
	}
}