using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Repositories;
using ParentTeacherBridge.API.Services;
using ParentTeacherBridge.API.Profiles; // ✅ This is needed to reference MappingProfile

var builder = WebApplication.CreateBuilder(args);

// 📦 Add controller and Swagger services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🛠️ Configure Entity Framework with SQL Server
builder.Services.AddDbContext<ParentTeacherBridgeAPIContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
            sqlOptions.CommandTimeout(30);
        });

    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// 🔁 Register AutoMapper using direct assembly reference
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// 📡 Enable SignalR for real-time updates
builder.Services.AddSignalR();

// 📦 Register domain repositories and services
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IParentRepository, ParentRepository>();
builder.Services.AddScoped<IParentService, ParentService>();

// 🌐 Allow frontend access via CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 🚀 Configure middleware and request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
