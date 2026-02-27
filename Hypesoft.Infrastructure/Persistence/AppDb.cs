// Este código define a classe `AppDb`, que implementa a interface `IProductRepository` para gerenciar produtos e categorias em um banco de dados MongoDB. A classe inclui métodos para operações CRUD (Create, Read, Update, Delete) tanto para produtos quanto para categorias.

using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Interfaces;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hypesoft.Infrastructure.Persistence;

public class AppDb : IProductRepository
{
    private readonly IMongoCollection<Product> _products;
    // 1. Adicionamos a coleção de categorias
    private readonly IMongoCollection<Category> _categories;

    public AppDb(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("HypesoftDB");
        _products = database.GetCollection<Product>("Products");
        // 2. Inicializamos a coleção de categorias
        _categories = database.GetCollection<Category>("Categories");
    }

    // --- Métodos de Produtos (Já existentes) ---
    public async Task<IEnumerable<Product>> GetAllAsync() => 
        await _products.Find(_ => true).ToListAsync();

    public async Task<Product?> GetByIdAsync(string id) => 
        await _products.Find(p => p.Id.ToString() == id).FirstOrDefaultAsync();

    public async Task AddAsync(Product product) => 
        await _products.InsertOneAsync(product);

    public async Task UpdateAsync(Product product) => 
        await _products.ReplaceOneAsync(p => p.Id == product.Id, product);

    public async Task DeleteAsync(string id) => 
        await _products.DeleteOneAsync(p => p.Id.ToString() == id);

    // --- 3. NOVOS MÉTODOS DE CATEGORIAS ---
    public async Task<List<Category>> GetAllCategoriesAsync() => 
        await _categories.Find(_ => true).ToListAsync();

    public async Task CreateCategoryAsync(Category category) => 
        await _categories.InsertOneAsync(category);
}