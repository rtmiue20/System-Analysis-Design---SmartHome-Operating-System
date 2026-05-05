using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SM_OS.Migrations
{
    /// <inheritdoc />
    public partial class AddAutomationAndTelemetry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AutomationRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RuleName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConditionOperator = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConditionValue = table.Column<float>(type: "float", nullable: false),
                    TargetStatus = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SensorDeviceId = table.Column<int>(type: "int", nullable: false),
                    ActionDeviceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutomationRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AutomationRules_SmartDevices_ActionDeviceId",
                        column: x => x.ActionDeviceId,
                        principalTable: "SmartDevices",
                        principalColumn: "DeviceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AutomationRules_SmartDevices_SensorDeviceId",
                        column: x => x.SensorDeviceId,
                        principalTable: "SmartDevices",
                        principalColumn: "DeviceId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DeviceSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TriggerTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    DaysOfWeek = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetStatus = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SmartDeviceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceSchedules_SmartDevices_SmartDeviceId",
                        column: x => x.SmartDeviceId,
                        principalTable: "SmartDevices",
                        principalColumn: "DeviceId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SensorTelemetries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Value = table.Column<float>(type: "float", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SmartDeviceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorTelemetries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SensorTelemetries_SmartDevices_SmartDeviceId",
                        column: x => x.SmartDeviceId,
                        principalTable: "SmartDevices",
                        principalColumn: "DeviceId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AutomationRules_ActionDeviceId",
                table: "AutomationRules",
                column: "ActionDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_AutomationRules_SensorDeviceId",
                table: "AutomationRules",
                column: "SensorDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceSchedules_SmartDeviceId",
                table: "DeviceSchedules",
                column: "SmartDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorTelemetries_SmartDeviceId",
                table: "SensorTelemetries",
                column: "SmartDeviceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutomationRules");

            migrationBuilder.DropTable(
                name: "DeviceSchedules");

            migrationBuilder.DropTable(
                name: "SensorTelemetries");
        }
    }
}
