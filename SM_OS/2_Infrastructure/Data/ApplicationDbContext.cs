using Microsoft.EntityFrameworkCore;
using SM_OS.Entities;

namespace SM_OS.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<SmartDevice> SmartDevices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Scene> Scenes { get; set; }
        public DbSet<SceneAction> SceneActions { get; set; }
        public DbSet<DeviceSchedule> DeviceSchedules { get; set; }
        public DbSet<AutomationRule> AutomationRules { get; set; }
        public DbSet<SensorTelemetry> SensorTelemetries { get; set; }


        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    // Cấu hình quan hệ 1-N giữa Room và SmartDevice
        //    modelBuilder.Entity<SmartDevice>()
        //        .HasOne(d => d.Room)
        //        .WithMany(r => r.SmartDevices)
        //        .HasForeignKey(d => d.RoomId)
        //        .OnDelete(DeleteBehavior.Cascade); // Xóa phòng thì xóa luôn thiết bị

        //    // Cấu hình khóa chính cho Room
        //    modelBuilder.Entity<Room>().HasKey(r => r.RoomId);

        //    // Cấu hình khóa chính cho SmartDevice
        //    modelBuilder.Entity<SmartDevice>().HasKey(d => d.DeviceId);
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Bỏ qua cột AdditionalData, không map xuống Database
            modelBuilder.Entity<SmartDevice>().Ignore(d => d.AdditionalData);

            // Cấu hình quan hệ 1-N giữa Room và SmartDevice
            modelBuilder.Entity<SmartDevice>()
                .HasOne(d => d.Room)
                .WithMany(r => r.SmartDevices)
                .HasForeignKey(d => d.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình khóa chính cho Room
            modelBuilder.Entity<Room>().HasKey(r => r.RoomId);

            // Cấu hình khóa chính cho SmartDevice
            modelBuilder.Entity<SmartDevice>().HasKey(d => d.DeviceId);

            // Cấu hình cho AutomationRule để tránh lỗi "Multiple Cascade Paths"
            modelBuilder.Entity<AutomationRule>()
                .HasOne(a => a.SensorDevice)
                .WithMany()
                .HasForeignKey(a => a.SensorDeviceId)
                .OnDelete(DeleteBehavior.Restrict); // Tắt tự động xóa dây chuyền cho Sensor

            modelBuilder.Entity<AutomationRule>()
                .HasOne(a => a.ActionDevice)
                .WithMany()
                .HasForeignKey(a => a.ActionDeviceId)
                .OnDelete(DeleteBehavior.Cascade);  // Vẫn cho phép xóa dây chuyền cho Action Device
        }
    }
}