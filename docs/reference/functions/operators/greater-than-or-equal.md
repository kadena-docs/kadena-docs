# Greater Than or Equal To Operator (`>=`)

The greater than or equal to operator (`>=`) in Pact is used to compare two values and check if the first is greater than or equal to the second.

## Syntax

```lisp
(>= x y)
```

## Parameters

- `x`: First value to compare
- `y`: Second value to compare

## Return Value

Returns `true` if `x` is greater than or equal to `y`, `false` otherwise.

## Supported Types

The greater than or equal to operator supports the following types:
- integer
- decimal
- string
- time

## Examples

### Comparing Numbers

```lisp
pact> (>= 5 3)
true

pact> (>= 5 5)
true

pact> (>= 3 5)
false

pact> (>= 3.6 3.5)
true
```

### Comparing Strings

```lisp
pact> (>= "def" "abc")
true

pact> (>= "hello" "hello")
true
```

### Comparing Times

```lisp
pact> (>= (time "2023-01-02T00:00:00Z") (time "2023-01-01T00:00:00Z"))
true
```

## Notes

- String comparisons are based on lexicographic order.
- Time comparisons are based on chronological order.

## See Also

- [`>`](greater-than.md): Greater than operator
- [`<`](less-than.md): Less than operator
- [`<=`](less-than-or-equal.md): Less than or equal to operator
