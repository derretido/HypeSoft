// Essa classe representa a entidade de categoria, que é usada para organizar os produtos em diferentes categorias. Ela possui um Id único e um nome. O construtor recebe o nome da categoria e gera um Id automaticamente. O construtor privado é necessário para o MongoDB poder criar instâncias da classe ao ler os dados do banco.

namespace Hypesoft.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;

    public Category(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
    }

    private Category() { }
}