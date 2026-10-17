FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
# HTTPS only: the certificate is mounted at runtime (see compose.yaml)
ENV ASPNETCORE_URLS=https://+:8081
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NoshServer.slnx", "./"]
COPY ["NoshServer.Api/NoshServer.Api.csproj", "NoshServer.Api/"]
COPY ["NoshServer.Api.Contracts/NoshServer.Api.Contracts.csproj", "NoshServer.Api.Contracts/"]
COPY ["NoshServer.Application/NoshServer.Application.csproj", "NoshServer.Application/"]
COPY ["NoshServer.Application.Models/NoshServer.Application.Models.csproj", "NoshServer.Application.Models/"]
RUN dotnet restore "NoshServer.Api/NoshServer.Api.csproj"
COPY . .
WORKDIR "/src/NoshServer.Api"
RUN dotnet build "./NoshServer.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build --no-restore

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NoshServer.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NoshServer.Api.dll"]
