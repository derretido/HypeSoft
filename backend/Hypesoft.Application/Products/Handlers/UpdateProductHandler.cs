// Handler para atualizar um produto existente
using Hypesoft.Domain.Interfaces;
using MediatR;

namespace Hypesoft.Application.Products.Handlers;

    
// Command para atualizar um produto existente
public record UpdateProductCommand(string Id, string Name, string Description, decimal Price, int StockQuantity, Guid CategoryId) : IRequest<bool>;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IProductRepository _repository;

    public UpdateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        // Usamos o Id direto pois agora ele é string no record
        var product = await _repository.GetByIdAsync(request.Id);

        if (product == null) return false;

        product.Update(request.Name, request.Description, request.Price, request.StockQuantity, request.CategoryId);
        
        await _repository.UpdateAsync(product);
        return true;
    }
}