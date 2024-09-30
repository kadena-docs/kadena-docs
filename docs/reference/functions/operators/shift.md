# Bitwise Shift Operator (shift)

The bitwise shift operator (`shift`) in Pact performs a bitwise shift operation on an integer.

## Syntax

```lisp
(shift x y)
```

## Parameters

- `x`: Integer to be shifted
- `y`: Number of positions to shift (positive for left shift, negative for right shift)

## Return Value

Returns the result of shifting `x` by `y` positions.

## Examples

### Left Shift

```lisp
pact> (shift 1 1)
2

pact> (shift 1 3)
8

pact> (shift 255 8)
65280
```

### Right Shift

```lisp
pact> (shift 8 -1)
4

pact> (shift 255 -4)
15

pact> (shift -8 -1)
-4
```

## Notes

- Left shift (`y` > 0) is equivalent to multiplying `x` by 2^y.
- Right shift (`y` < 0) is equivalent to integer division of `x` by 2^(-y).
- For negative numbers, right shift performs sign extension (fills with 1s instead of 0s).
- Shifting by 0 positions returns the original number.
- Be cautious with large shift values, as they might lead to unexpected results due to integer overflow.

## See Also

- [&](bitwise-and.md): Bitwise AND operator
- [|](bitwise-or.md): Bitwise OR operator
- [~](bitwise-not.md): Bitwise NOT operator
