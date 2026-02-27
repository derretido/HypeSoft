// Handler para buscar os dados do dashboard de produtos
using MediatR;
using Hypesoft.Application.Products.Queries;
using Hypesoft.Domain.Interfaces;

namespace Hypesoft.Application.Products.Handlers;

// Este handler é responsável por lidar com a Query de buscar os dados do dashboard de produtos. Ele utiliza o repositório para acessar o banco de dados e realizar os cálculos necessários para os cards do topo.
public class GetProductDashboardHandler : IRequestHandler<GetProductDashboardQuery, object>
{
    private readonly IProductRepository _repository;

    public GetProductDashboardHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> Handle(GetProductDashboardQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllAsync();
        
        // Retorna os cálculos para os cards do topo
        return new
        {
            TotalProducts = products.Count(),
            TotalStock =    products.Sum(p => p.StockQuantity),
            LowStockItems = products.Count(p => p.StockQuantity < 10),
            AveragePrice = products.Any() ? products.Average(p => p.Price) : 0
        };
    }
}