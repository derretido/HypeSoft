// Essa interface define os métodos que o repositório de produtos deve implementar, permitindo a manipulação dos dados de produtos no banco de dados. Ela é usada para abstrair a lógica de acesso aos dados e facilitar a manutenção e testabilidade do código.

using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(string id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(string id);
}