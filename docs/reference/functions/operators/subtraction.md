# Subtraction Operator (-)

The subtraction operator (`-`) in Pact is used to subtract one number from another or to negate a number.

## Syntax

```lisp
(- x y)
```
or
```lisp
(- x)
```

## Parameters

- `x`: First operand (number)
- `y`: Second operand (number, optional)

## Return Value

Returns the result of subtracting `y` from `x`, or the negation of `x` if `y` is not provided.

## Examples

### Subtracting Numbers

```lisp
pact> (- 5 3)
2

pact> (- 10.5 3.2)
7.3
```

### Negating a Number

```lisp
pact> (- 5)
-5

pact> (- -3.7)
3.7
```

## Notes

- The subtraction operator works with both integers and decimals.
- When used with a single argument, it negates the number.

## See Also

- [+](addition.md): Addition operator
- [*](multiplication.md): Multiplication operator
- [/](division.md): Division operator
