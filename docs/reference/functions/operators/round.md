# Round Operator (round)

The round operator (`round`) in Pact performs Banker's rounding on a decimal number.

## Syntax

```lisp
(round x)
```
or
```lisp
(round x prec)
```

## Parameters

- `x`: Decimal number to round
- `prec`: (Optional) Integer specifying the number of decimal places to round to

## Return Value

Returns the rounded value of `x`. If `prec` is not specified, it returns an integer. If `prec` is specified, it returns a decimal rounded to `prec` decimal places.

## Examples

### Basic Rounding (to Integer)

```lisp
pact> (round 3.5)
4

pact> (round 3.4)
3

pact> (round -3.5)
-4
```

### Rounding to Specific Precision

```lisp
pact> (round 3.14159 2)
3.14

pact> (round 3.14159 4)
3.1416

pact> (round -3.14159 2)
-3.14
```

## Notes

- Banker's rounding is used, which means that halfway cases (e.g., 3.5) are rounded to the nearest even integer.
- When rounding to a specific precision, the same principle applies for the last significant digit.
- This function is useful for financial calculations where consistent rounding behavior is important.

## See Also

- [floor](floor.md): Floor function
- [ceiling](ceiling.md): Ceiling function
