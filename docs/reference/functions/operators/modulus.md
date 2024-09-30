# Modulus Operator (mod)

The modulus operator (`mod`) in Pact computes the remainder of the division of two integers.

## Syntax

```lisp
(mod x y)
```

## Parameters

- `x`: Dividend (integer)
- `y`: Divisor (integer, must not be zero)

## Return Value

Returns the remainder of dividing `x` by `y`.

## Examples

### Basic Usage

```lisp
pact> (mod 10 3)
1

pact> (mod -10 3)
-1

pact> (mod 10 -3)
1
```

### Use Cases

```lisp
; Check if a number is even
pact> (= (mod 10 2) 0)
true

; Wrap around a range (e.g., clock hours)
pact> (mod 25 12)
1
```

## Notes

- The result of `(mod x y)` has the same sign as `x`.
- `mod` is only defined for integer operands. For decimal numbers, you can use `round`, `floor`, or `ceiling` in combination with other operators to achieve similar results.
- Division by zero will result in an error.

## See Also

- [/](division.md): Division operator
- [round](round.md): Rounding function
- [floor](floor.md): Floor function
- [ceiling](ceiling.md): Ceiling function

