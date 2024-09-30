# Ceiling Operator (ceiling)

The ceiling operator (`ceiling`) in Pact rounds a decimal number up to the nearest integer or to a specified precision.

## Syntax

```lisp
(ceiling x)
```
or
```lisp
(ceiling x prec)
```

## Parameters

- `x`: Decimal number to round up
- `prec`: (Optional) Integer specifying the number of decimal places to round to

## Return Value

Returns the ceiling value of `x`. If `prec` is not specified, it returns an integer. If `prec` is specified, it returns a decimal rounded up to `prec` decimal places.

## Examples

### Basic Ceiling (to Integer)

```lisp
pact> (ceiling 3.1)
4

pact> (ceiling 3.9)
4

pact> (ceiling -3.1)
-3
```

### Ceiling to Specific Precision

```lisp
pact> (ceiling 3.14159 2)
3.15

pact> (ceiling 3.14159 4)
3.1416

pact> (ceiling -3.14159 2)
-3.14
```

## Notes

- The ceiling function always rounds up, meaning it returns the smallest integer greater than or equal to the input.
- When rounding to a specific precision, it rounds up the last significant digit.
- For negative numbers, "rounding up" means towards zero.

## See Also

- [floor](floor.md): Floor function
- [round](round.md): Rounding function

