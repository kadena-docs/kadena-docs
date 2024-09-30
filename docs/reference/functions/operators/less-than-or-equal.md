# Less Than or Equal To Operator (`<=`)

The less than or equal to operator (`<=`) in Pact is used to compare two values and check if the first is less than or equal to the second.

## Syntax

```lisp
(<= x y)
```

## Parameters

- `x`: First value to compare
- `y`: Second value to compare

## Return Value

Returns `true` if `x` is less than or equal to `y`, `false` otherwise.

## Supported Types

The less than or equal to operator supports the following types:
- integer
- decimal
- string
- time

## Examples

### Comparing Numbers

```lisp
pact> (<= 3 5)
true

pact> (<= 5 5)
true

pact> (<= 7 5)
false

pact> (<= 3.5 3.6)
true
```

### Comparing Strings

```lisp
pact> (<= "abc" "def")
true

pact> (<= "hello" "hello")
true
```

### Comparing Times

```lisp
pact> (<= (time "2023-01-01T00:00:00Z") (time "2023-01-02T00:00:00Z"))
true
```

## Notes

- String comparisons are based on lexicographic order.
- Time comparisons are based on chronological order.

## See Also

- [`<`](less-than.md): Less than operator
- [`>`](greater-than.md): Greater than operator
- [`>=`](greater-than-or-equal.md): Greater than or equal to operator

