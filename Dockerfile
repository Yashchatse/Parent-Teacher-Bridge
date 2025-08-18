# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Backend/Parent_Teacher_WEBAPI.sln .
COPY Backend/ParentTeacherBridge.API/*.csproj ParentTeacherBridge.API/

# Restore dependencies
RUN dotnet restore Parent_Teacher_WEBAPI.sln

# Copy the rest of the source code
COPY Backend/. .

# Publish
WORKDIR /src/ParentTeacherBridge.API
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "ParentTeacherBridge.API.dll"]
