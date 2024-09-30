# Equality Operator (=)

The equality operator (`=`) in Pact is used to compare two values for equality.

## Syntax

```lisp
(= x y)
```

## Parameters

- `x`: First value to compare
- `y`: Second value to compare

## Return Value

Returns `true` if `x` is equal to `y`, `false` otherwise.

## Supported Types

The equality operator supports the following types:
- integer
- string
- time
- decimal
- bool
- list
- object
- keyset
- guard
- module

## Examples

### Comparing Numbers

```lisp
pact> (= 3 3)
true

pact> (= 3.0 3)
true

pact> (= 3 4)
false
```

### Comparing Strings

```lisp
pact> (= "hello" "hello")
true

pact> (= "hello" "world")
false
```

### Comparing Lists

```lisp
pact> (= [1 2 3] [1 2 3])
true

pact> (= [1 2 3] [3 2 1])
false
```

### Comparing Objects

```lisp
pact> (= { 'a: 1, 'b: 2 } { 'b: 2, 'a: 1 })
true

pact> (= { 'a: 1, 'b: 2 } { 'a: 1, 'b: 3 })
false
```

## Notes

- The equality operator performs a deep comparison for complex types like lists and objects.
- For floating-point numbers, be aware of potential precision issues when comparing.

## See Also

- [!=](inequality.md): Inequality operator
- [`<`](less-than.md): Less than operator
- [`>`](greater-than.md): Greater than operator
