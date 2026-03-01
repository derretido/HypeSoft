using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Interfaces;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories;

// Essa classe implementa a interface ICategoryRepository, fornecendo os métodos para manipular os dados de categorias no banco de dados MongoDB. Ela utiliza o IMongoDatabase para acessar a coleção de categorias e realizar as operações CRUD (Create, Read, Update, Delete). Cada método é assíncrono para melhorar a performance e escalabilidade da aplicação.
public class CategoryRepository(IMongoDatabase database) : ICategoryRepository
{
    private readonly IMongoCollection<Category> _categories = database.GetCollection<Category>("Categories");

    public async Task<List<Category>> GetAllAsync()
    {
        return await _categories.Find(c => true).ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        var guidId = Guid.Parse(id);
        return await _categories.Find(c => c.Id == guidId).FirstOrDefaultAsync();
    }

    public async Task AddAsync(Category category)
    {
        await _categories.InsertOneAsync(category);
    }

    public async Task UpdateAsync(Category category)
    {
        await _categories.ReplaceOneAsync(c => c.Id == category.Id, category);
    }

    public async Task DeleteAsync(string id)
    {
        var guidId = Guid.Parse(id);
        await _categories.DeleteOneAsync(c => c.Id == guidId);
    }
}