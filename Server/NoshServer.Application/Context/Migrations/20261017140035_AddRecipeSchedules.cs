using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoshServer.Application.Context.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeSchedules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecipeSchedules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipeId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    MealType = table.Column<string>(type: "text", nullable: false),
                    Frequency = table.Column<string>(type: "text", nullable: false),
                    Interval = table.Column<int>(type: "integer", nullable: false),
                    DaysOfWeek = table.Column<string[]>(type: "text[]", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    MaxOccurrences = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeSchedules_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeSchedules_RecipeId",
                table: "RecipeSchedules",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeSchedules_StartDate_EndDate",
                table: "RecipeSchedules",
                columns: new[] { "StartDate", "EndDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeSchedules");
        }
    }
}
