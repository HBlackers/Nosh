using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoshServer.Api.Filters;
using NoshServer.Api.OpenApi;
using NoshServer.Application.Context;
using NoshServer.Application.Options;
using NoshServer.Application.Repositories;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services;
using NoshServer.Application.Services.Abstractions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services
    .AddControllers(options => options.Filters.Add<GlobalExceptionFilter>())
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddValidatorsFromAssembly(typeof(NoshContext).Assembly);

builder.Services.AddDbContext<NoshContext>(options => options.UseNpgsql(
    builder.Configuration.GetConnectionString("Nosh")
    ?? throw new InvalidOperationException("Connection string 'Nosh' is not configured.")));

builder.Services.Configure<SampleRecipesOptions>(builder.Configuration.GetSection(SampleRecipesOptions.SectionName));

builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();
builder.Services.AddScoped<IRecipeIngredientRepository, RecipeIngredientRepository>();

builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IRecipeService, RecipeService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options => options.AddSchemaTransformer<EnumSchemaTransformer>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "NoshServer.Api v1"));
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();