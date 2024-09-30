# Floor Operator (floor)

The floor operator (`floor`) in Pact rounds a decimal number down to the nearest integer or to a specified precision.

## Syntax

```lisp
(floor x)
```
or
```lisp
(floor x prec)
```

## Parameters

- `x`: Decimal number to round down
- `prec`: (Optional) Integer specifying the number of decimal places to round to

## Return Value

Returns the floor value of `x`. If `prec` is not specified, it returns an integer. If `prec` is specified, it returns a decimal rounded down to `prec` decimal places.

## Examples

### Basic Floor (to Integer)

```lisp
pact> (floor 3.1)
3

pact> (floor 3.9)
3

pact> (floor -3.1)
-4
```

### Floor to Specific Precision

```lisp
pact> (floor 3.14159 2)
3.14

pact> (floor 3.14159 4)
3.1415

pact> (floor -3.14159 2)
-3.15
```

## Notes

- The floor function always rounds down, meaning it returns the largest integer less than or equal to the input.
- When rounding to a specific precision, it rounds down the last significant digit.
- For negative numbers, "rounding down" means away from zero.

## See Also

- [ceiling](ceiling.md): Ceiling function
- [round](round.md): Rounding function
