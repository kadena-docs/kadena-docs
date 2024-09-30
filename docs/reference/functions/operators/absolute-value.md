# Absolute Value Operator (abs)

The absolute value operator (`abs`) in Pact returns the absolute value of a number.

## Syntax

```lisp
(abs x)
```

## Parameters

- `x`: Number (integer or decimal)

## Return Value

Returns the absolute value of `x`.

## Examples

### Integers

```lisp
pact> (abs 5)
5

pact> (abs -5)
5

pact> (abs 0)
0
```

### Decimals

```lisp
pact> (abs 3.14)
3.14

pact> (abs -3.14)
3.14
```

## Notes

- The absolute value of a number is its distance from zero on the number line, regardless of whether it's positive or negative.
- `abs` works with both integers and decimals.
- The result is always non-negative.

## See Also

- [-](subtraction.md): Subtraction and negation operator

