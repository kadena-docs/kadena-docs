# Exponentiation Operator (^)

The exponentiation operator (`^`) in Pact is used to raise a number to the power of another.

## Syntax

```lisp
(^ x y)
```

## Parameters

- `x`: Base (number)
- `y`: Exponent (number)

## Return Value

Returns `x` raised to the power of `y`.

## Examples

### Integer Exponentiation

```lisp
pact> (^ 2 3)
8

pact> (^ 5 2)
25
```

### Decimal Exponentiation

```lisp
pact> (^ 2.0 3.0)
8.0

pact> (^ 5.5 2.0)
30.25
```

### Negative Exponents

```lisp
pact> (^ 2 -3)
0.125
```

## Notes

- The exponentiation operator works with both integers and decimals.
- When using integer operands, the result is an integer if the exponent is non-negative.
- When using decimal operands or a negative exponent, the result is always a decimal.

## See Also

- [*](multiplication.md): Multiplication operator

