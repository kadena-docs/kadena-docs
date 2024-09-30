# Less Than Operator (`<`)

The less than operator (`<`) in Pact is used to compare two values and check if the first is less than the second.

## Syntax

```lisp
(< x y)
```

## Parameters

- `x`: First value to compare
- `y`: Second value to compare

## Return Value

Returns `true` if `x` is less than `y`, `false` otherwise.

## Supported Types

The less than operator supports the following types:
- integer
- decimal
- string
- time

## Examples

### Comparing Numbers

```lisp
pact> (< 3 5)
true

pact> (< 5 3)
false

pact> (< 3.5 3.6)
true
```

### Comparing Strings

```lisp
pact> (< "abc" "def")
true

pact> (< "hello" "hello")
false
```

### Comparing Times

```lisp
pact> (< (time "2023-01-01T00:00:00Z") (time "2023-01-02T00:00:00Z"))
true
```

## Notes

- String comparisons are based on lexicographic order.
- Time comparisons are based on chronological order.

## See Also

- [`>`](greater-than.md): Greater than operator
- [`<=`](less-than-or-equal.md): Less than or equal to operator
- [`>=`](greater-than-or-equal.md): Greater than or equal to operator

