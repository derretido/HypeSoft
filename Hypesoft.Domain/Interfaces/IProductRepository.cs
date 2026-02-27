// Define a interface do repositório de produtos
using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Interfaces;

// Interface para o repositório de produtos, definindo os métodos necessários para manipulação dos dados
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(string id); 
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(string id);

    Task<List<Category>> GetAllCategoriesAsync();
    Task CreateCategoryAsync(Category category);
}