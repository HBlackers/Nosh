using System.Text.Json.Nodes;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace NoshServer.Api.OpenApi;

/// <summary>
/// Describes enums in the OpenAPI document as strings holding the enum names, matching how they are
/// serialised in JSON, rather than as integers.
/// </summary>
public class EnumSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        var type = context.JsonTypeInfo.Type;
        type = Nullable.GetUnderlyingType(type) ?? type;

        if (!type.IsEnum)
            return Task.CompletedTask;
        
        schema.Type = JsonSchemaType.String;
        schema.Format = null;
        schema.Enum = [.. Enum.GetNames(type).Select(JsonNode (name) => JsonValue.Create(name))];

        return Task.CompletedTask;
    }
}
