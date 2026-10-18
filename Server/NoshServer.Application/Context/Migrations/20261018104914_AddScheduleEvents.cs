using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoshServer.Application.Context.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduleEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScheduleEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduleEvents_RecipeSchedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "RecipeSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleEvents_Date",
                table: "ScheduleEvents",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleEvents_ScheduleId_Date",
                table: "ScheduleEvents",
                columns: new[] { "ScheduleId", "Date" },
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScheduleEvents");
        }
    }
}
