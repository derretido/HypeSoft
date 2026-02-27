// Command para criar um novo produto

using MediatR;

namespace Hypesoft.Application.Products.Commands;

public class CreateProductCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}