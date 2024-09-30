# Inequality Operator (!=)

The inequality operator (`!=`) in Pact is used to check if two values are not equal.

## Syntax

```lisp
(!= x y)
```

## Parameters

- `x`: First value to compare
- `y`: Second value to compare

## Return Value

Returns `true` if `x` is not equal to `y`, `false` otherwise.

## Supported Types

The inequality operator supports the following types:
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
pact> (!= 3 4)
true

pact> (!= 3.0 3)
false
```

### Comparing Strings

```lisp
pact> (!= "hello" "world")
true

pact> (!= "hello" "hello")
false
```

### Comparing Lists

```lisp
pact> (!= [1 2 3] [3 2 1])
true

pact> (!= [1 2 3] [1 2 3])
false
```

### Comparing Objects

```lisp
pact> (!= { 'a: 1, 'b: 2 } { 'a: 1, 'b: 3 })
true

pact> (!= { 'a: 1, 'b: 2 } { 'b: 2, 'a: 1 })
false
```

## Notes

- The inequality operator performs a deep comparison for complex types like lists and objects.
- For floating-point numbers, be aware of potential precision issues when comparing.

## See Also

- [=](equality.md): Equality operator
- [`<`](less-than.md): Less than operator
- [`>`](greater-than.md): Greater than operator
