namespace SM_OS.Hubs.Interface
{
    public interface ISmartHomeClient
    {
        Task ReceiveDeviceUpdate(int deviceId, bool status);
    }
}
