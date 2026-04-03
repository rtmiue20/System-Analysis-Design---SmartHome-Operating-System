using Microsoft.AspNetCore.SignalR;
using SM_OS.Hubs.Interface;

namespace SM_OS.Hubs
{
    public class SmartHomeHub : Hub<ISmartHomeClient>
    {
    }
}
