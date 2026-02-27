using Microsoft.AspNetCore.Mvc;
using MediatR;
using Hypesoft.Application.Products.Queries;
using Hypesoft.Application.Products.Handlers;
using Hypesoft.Application.Products.Commands;
using Microsoft.AspNetCore.Authorization;
namespace Hypesoft.API.Controllers;



[Authorize]
[ApiController]
[Route("api/[controller]")]

// Controller para gerenciar produtos
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    //dashboard para mostrar os produtos
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _mediator.Send(new GetProductDashboardQuery());
        return Ok(result);
    }

    // get para listar todos os produtos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Envia uma Query que busca todos os produtos no MongoDB
        var result = await _mediator.Send(new GetAllProductsQuery());
        return Ok(result);
    }

    // post para criar um novo produto
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // put para atualizar um produto existente
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await _mediator.Send(command);
        if (!result) return NotFound(); // Se o handler retornou false
        return NoContent(); // Sucesso!
    }
    // delete para remover um produto
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        // Envia o comando de exclusão passando apenas o ID
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent(); // Retorna 204 (Sucesso sem conteúdo)
    }
}