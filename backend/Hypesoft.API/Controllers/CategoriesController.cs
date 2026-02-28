using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hypesoft.Domain.Interfaces;
using Hypesoft.Domain.Entities;

namespace Hypesoft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _repository;

    public CategoriesController(ICategoryRepository repository)
    {
        _repository = repository;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _repository.GetAllAsync();
        return Ok(result);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] string name)
    {
        var category = new Category(name);
        await _repository.AddAsync(category);
        return Ok(category);
    }
}