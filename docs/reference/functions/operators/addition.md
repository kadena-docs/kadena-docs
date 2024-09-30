
# Addition Operator (+)

The addition operator (`+`) in Pact is used to add numbers, concatenate strings/lists, or merge objects.

## Syntax

```lisp
(+ x y)
```

## Parameters

- `x`: First operand (number, string, list, or object)
- `y`: Second operand (must be of the same type as `x`)

## Return Value

Returns the result of adding `x` and `y`, which can be:
- The sum of two numbers
- The concatenation of two strings or lists
- The merged result of two objects

## Examples

### Adding Numbers

```lisp
pact> (+ 1 2)
3

pact> (+ 5.0 0.5)
5.5
```

### Concatenating Strings

```lisp
pact> (+ "every" "body")
"everybody"
```

### Concatenating Lists

```lisp
pact> (+ [1 2] [3 4])
[1 2 3 4]
```

### Merging Objects

```lisp
pact> (+ { "foo": 100 } { "foo": 1, "bar": 2 })
{"bar": 2, "foo": 100}
```

## Notes

- When adding objects, if both objects have the same key, the value from the first object is kept.
- The `+` operator can be used with more than two operands, e.g., `(+ 1 2 3 4)`.

## See Also

- [-](subtraction.md): Subtraction operator
- [*](multiplication.md): Multiplication operator
- [/](division.md): Division operator

