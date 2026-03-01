//Criação e validação do comando para criar um produto

using FluentValidation;

namespace Hypesoft.Application.Products.Commands;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
        .NotEmpty().WithMessage("O nome do produto é obrigatorio.")
        .MaximumLength(100).WithMessage("O nome do produto não pode exceder 100 caracteres.");

        RuleFor(x => x.Price)
        .GreaterThan(0).WithMessage("O preço do produto deve ser maior que zero.");

        RuleFor(x => x.StockQuantity)
        .GreaterThanOrEqualTo(0).WithMessage("O estoque do produto não pode ser negativo.");

    }
}