// Handler para buscar todos os produtos
using MediatR;
using Hypesoft.Application.Products.Queries;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Interfaces;

namespace Hypesoft.Application.Products.Handlers;
// Este handler é responsável por lidar com a Query de buscar todos os produtos. Ele utiliza o repositório para acessar o banco de dados e retornar a lista de produtos.
public class GetAllProductsHandler : IRequestHandler<GetAllProductsQuery, IEnumerable<Product>>
{
    private readonly IProductRepository _repository;

    public GetAllProductsHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Product>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        // Busca todos os produtos do banco para mostrar na tela
        return await _repository.GetAllAsync();
    }
}