// define a query para obter todos os produtos
using MediatR;
using Hypesoft.Domain.Entities; // Ajuste conforme seu namespace de entidades

namespace Hypesoft.Application.Products.Queries;

// Define o que a query retorna (uma lista de produtos)
public record GetAllProductsQuery() : IRequest<IEnumerable<Product>>;