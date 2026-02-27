//Representa a categoria de um produto, como "Eletrônicos", "Roupas", etc.

namespace Hypesoft.Domain.Entities;

public class Category
{
    public Guid id {get; private set;}
    public string Name {get; private set;} = string.Empty;

    public Category(string name)
    {
        id = Guid.NewGuid();
        Name = name;
    }
}