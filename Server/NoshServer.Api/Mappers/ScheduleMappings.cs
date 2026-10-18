using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Schedules.Requests;
using NoshServer.Api.Contracts.Schedules.Responses;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Mappers;

public static class ScheduleMappings
{
    public static RecipeSchedule ToModel(this CreateScheduleRequest request)
    {
        return new RecipeSchedule
        {
            RecipeId = request.RecipeId,
            StartDate = request.StartDate,
            MealType = request.MealType,
            Frequency = request.Frequency,
            Interval = request.Interval,
            DaysOfWeek = request.DaysOfWeek,
            EndDate = request.EndDate,
            MaxOccurrences = request.MaxOccurrences,
        };
    }

    /// <summary>
    /// Applies the request to an existing schedule. Its id and timestamps are left as they are.
    /// </summary>
    public static void ApplyTo(this UpdateScheduleRequest request, RecipeSchedule schedule)
    {
        schedule.RecipeId = request.RecipeId;
        schedule.Recipe = null;
        schedule.StartDate = request.StartDate;
        schedule.MealType = request.MealType;
        schedule.Frequency = request.Frequency;
        schedule.Interval = request.Interval;
        schedule.DaysOfWeek = request.DaysOfWeek;
        schedule.EndDate = request.EndDate;
        schedule.MaxOccurrences = request.MaxOccurrences;
    }

    public static ScheduleResponse ToResponse(this RecipeSchedule schedule)
    {
        return new ScheduleResponse(
            schedule.Id,
            schedule.ToRecipeResponse(),
            schedule.StartDate,
            schedule.MealType,
            schedule.Frequency,
            schedule.Interval,
            schedule.DaysOfWeek,
            schedule.EndDate,
            schedule.MaxOccurrences);
    }

    public static ScheduleOccurrenceResponse ToResponse(this ScheduleOccurrence occurrence)
    {
        return new ScheduleOccurrenceResponse(
            occurrence.Schedule.Id,
            occurrence.Date,
            occurrence.Schedule.MealType,
            occurrence.Schedule.Frequency != RecurrenceFrequency.None,
            occurrence.Schedule.ToRecipeResponse(),
            occurrence.Event?.ToResponse(),
            occurrence.Availability?.ToResponse());
    }

    public static ScheduleEvent ToModel(this CreateScheduleEventRequest request)
    {
        return new ScheduleEvent { ScheduleId = request.ScheduleId, Date = request.Date, Status = request.Status };
    }

    /// <summary>
    /// Applies the request to an existing event. Its id, schedule, date and timestamps are left as they are.
    /// </summary>
    public static void ApplyTo(this UpdateScheduleEventRequest request, ScheduleEvent scheduleEvent)
    {
        scheduleEvent.Status = request.Status;
    }

    public static ScheduleEventResponse ToResponse(this ScheduleEvent scheduleEvent)
    {
        return new ScheduleEventResponse(scheduleEvent.Id, scheduleEvent.ScheduleId, scheduleEvent.Date, scheduleEvent.Status);
    }

    private static MealAvailabilityResponse ToResponse(this MealAvailability availability)
    {
        return new MealAvailabilityResponse(
            availability.Status,
            availability.IngredientsTotal,
            availability.IngredientsCovered,
            [.. availability.Lacking.Select(l => new LackingIngredientResponse(l.IngredientId, l.IngredientName, l.Needed?.ToResponse(), l.Available?.ToResponse()))]);
    }

    private static QuantityResponse ToResponse(this Quantity quantity)
    {
        return new QuantityResponse(quantity.Amount, quantity.Unit);
    }

    private static ScheduleRecipeResponse ToRecipeResponse(this RecipeSchedule schedule)
    {
        return new ScheduleRecipeResponse(
            schedule.RecipeId,
            schedule.Recipe?.Name ?? string.Empty,
            schedule.Recipe?.Slug ?? string.Empty);
    }
}
