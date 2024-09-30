# Multiplication Operator (*)

The multiplication operator (`*`) in Pact is used to multiply two numbers.

## Syntax

```lisp
(* x y)
```

## Parameters

- `x`: First operand (number)
- `y`: Second operand (number)

## Return Value

Returns the product of `x` and `y`.

## Examples

### Multiplying Integers

```lisp
pact> (* 3 5)
15
```

### Multiplying Decimals

```lisp
pact> (* 0.5 10.0)
5.0
```

### Mixing Integer and Decimal

```lisp
pact> (* 2 3.5)
7.0
```

## Notes

- The multiplication operator works with both integers and decimals.
- When multiplying an integer with a decimal, the result is always a decimal.

## See Also

- [+](addition.md): Addition operator
- [-](subtraction.md): Subtraction operator
- [/](division.md): Division operator

