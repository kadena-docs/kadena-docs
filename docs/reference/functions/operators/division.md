# Division Operator (/)

The division operator (`/`) in Pact is used to divide one number by another.

## Syntax

```lisp
(/ x y)
```

## Parameters

- `x`: Dividend (number)
- `y`: Divisor (number, must not be zero)

## Return Value

Returns the result of dividing `x` by `y`.

## Examples

### Dividing Integers

```lisp
pact> (/ 10 2)
5

pact> (/ 8 3)
2
```

### Dividing Decimals

```lisp
pact> (/ 10.0 2.0)
5.0

pact> (/ 5.5 2.0)
2.75
```

### Mixing Integer and Decimal

```lisp
pact> (/ 10 4.0)
2.5
```

## Notes

- When dividing integers, the result is truncated (rounded down) to the nearest integer.
- When dividing with at least one decimal operand, the result is a decimal.
- Division by zero will result in an error.

## See Also

- [*](multiplication.md): Multiplication operator
- [mod](modulus.md): Modulus operator

