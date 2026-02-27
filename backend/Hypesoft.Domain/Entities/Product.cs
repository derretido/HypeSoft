// Define a entidade de produto

using System;

namespace Hypesoft.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid CategoryId { get; private set; }

    // Construtor para o EF/MongoDB
    private Product() { }

    public Product(string name, string description, decimal price, int stockQuantity, Guid categoryId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
    }

    public void Update(string name, string description, decimal price, int stockQuantity, Guid categoryId)
    {
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
    }
}