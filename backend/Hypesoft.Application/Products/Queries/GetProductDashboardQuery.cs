// define a query para obter o dashboard de produtos
using MediatR;
using Hypesoft.Domain.Interfaces;
using DnsClient.Protocol;

namespace Hypesoft.Application.Products.Queries;

public record Dashboard(
    int TotalProducts,
    decimal TotalStock,
    List<string> LowStockProducts
);
// Define o que a query retorna (o dashboard de produtos)
public record GetProductDashboardQuery() : IRequest<Dashboard>;

public class GetProductDashboardHandler : IRequestHandler<GetProductDashboardQuery, Dashboard>
{
    private readonly IProductRepository _repository;

    public GetProductDashboardHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Dashboard> Handle(GetProductDashboardQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllAsync();

        var totalValues = products.Sum(p => p.Price * p.StockQuantity);
        var lowStock = products
            .Where(p => p.StockQuantity < 10) // estoque baixo
            .Select(p => p.Name)
            .ToList();
        
        return new Dashboard(
            products.Count(), // Total de produtos
            totalValues, // Valor total do estoque
            lowStock // Lista de produtos com estoque baixo
        );
    }
}