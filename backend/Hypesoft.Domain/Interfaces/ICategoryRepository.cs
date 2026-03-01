// Essa interface define os métodos que o repositório de categorias deve implementar, permitindo a manipulação dos dados de categorias no banco de dados. Ela é usada para abstrair a lógica de acesso aos dados e facilitar a manutenção e testabilidade do código.

using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(string id);
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(string id);
}