using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hypesoft.Domain.Interfaces;
using Hypesoft.Domain.Entities;

namespace Hypesoft.API.Controllers;

[Authorize] // Mantém a segurança do Keycloak
[ApiController]
[Route("api/[controller]")]

// Controller para gerenciar categorias de produtos
public class CategoriesController : ControllerBase
{
    private readonly IProductRepository _repository;

    public CategoriesController(IProductRepository repository)
    {
        _repository = repository;
    }

    // get para listar todas as categorias
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _repository.GetAllCategoriesAsync();
        return Ok(result);
    }

    // post para criar uma nova categoria
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] string name)
    {
        var category = new Category(name);
        await _repository.CreateCategoryAsync(category);
        return Ok(category);
    }
}