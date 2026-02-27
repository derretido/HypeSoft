// Handler para criar um novo produto
using MediatR;
using Hypesoft.Application.Products.Commands;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Interfaces;

namespace Hypesoft.Application.Products.Handlers;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _repository;

    public CreateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 1. Converte a string CategoryId para o tipo Guid
        if (!Guid.TryParse(request.CategoryId, out Guid categoryGuid))
        {
            // Opcional: define um Guid vazio ou padrão se a conversão falhar
            categoryGuid = Guid.Empty; 
        }

        // 2. Cria a entidade usando o construtor do Domínio
        var product = new Product(
            request.Name, 
            request.Description, 
            request.Price, 
            request.StockQuantity, 
            categoryGuid 
        );
        
        // 3. Persiste no banco de dados (MongoDB)
        await _repository.AddAsync(product);
        
        // 4. Retorna o ID (verifique se na sua classe Product é 'Id' ou 'id')
        return product.Id; 
    }
}