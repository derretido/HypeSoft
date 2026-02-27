using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Hypesoft.Domain.Interfaces;
using Hypesoft.Infrastructure.Persistence;
using Hypesoft.Application.Products.Handlers;
// USINGS PARA SEGURANÇA
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS0618
BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
#pragma warning restore CS0618

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configurações do MongoDB ---
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDb") 
                            ?? "mongodb://localhost:27017";

builder.Services.AddSingleton<IMongoClient>(sp => 
{
    return new MongoClient(mongoConnectionString);
});

// --- 2. Registro do Repositório ---
builder.Services.AddScoped<IProductRepository, AppDb>();

// --- 3. Registro do MediatR ---
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateProductHandler).Assembly);
});

// --- 4. CONFIGURAÇÃO DO KEYCLOAK (AUTENTICAÇÃO) ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:8080/realms/Hypesoft";
        options.RequireHttpsMetadata = false; // Apenas para dev local
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidIssuer = "http://localhost:8080/realms/Hypesoft"
        };
    });

builder.Services.AddAuthorization();

// --- 5. Serviços Padrão da API ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- 6. Pipeline de Execução (Middleware) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// IMPORTANTE: Authentication deve vir ANTES de Authorization
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();