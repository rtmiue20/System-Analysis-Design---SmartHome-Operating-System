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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình quan hệ 1-N giữa Room và SmartDevice
            modelBuilder.Entity<SmartDevice>()
                .HasOne(d => d.Room)
                .WithMany(r => r.SmartDevices)
                .HasForeignKey(d => d.RoomId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa phòng thì xóa luôn thiết bị

            // Cấu hình khóa chính cho Room (nếu bạn đặt tên là RoomId thay vì Id)
            modelBuilder.Entity<Room>().HasKey(r => r.RoomId);

            // Cấu hình khóa chính cho SmartDevice
            modelBuilder.Entity<SmartDevice>().HasKey(d => d.DeviceId);
        }
    }
}