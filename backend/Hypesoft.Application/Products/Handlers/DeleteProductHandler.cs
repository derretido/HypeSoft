// Handler para deletar um produto existente
using MediatR;
using Hypesoft.Application.Products.Handlers;
using Hypesoft.Domain.Interfaces;

namespace Hypesoft.Application.Products.Handlers;

public record DeleteProductCommand(string Id) : IRequest<bool>;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _repository;

    public DeleteProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return false;

        await _repository.DeleteAsync(request.Id);
        return true;
    }
}