# Logical OR Operator (or)

The logical OR operator (`or`) in Pact performs a boolean OR operation with short-circuit evaluation.

## Syntax

```lisp
(or x y)
```

## Parameters

- `x`: First boolean expression
- `y`: Second boolean expression

## Return Value

Returns `true` if either `x` or `y` (or both) are `true`, `false` otherwise.

## Short-Circuit Evaluation

The `or` operator uses short-circuit evaluation, meaning that if `x` is `true`, `y` is not evaluated, and the result is immediately `true`.

## Examples

### Basic Usage

```lisp
pact> (or true false)
true

pact> (or false true)
true

pact> (or true true)
true

pact> (or false false)
false
```

### With Expressions

```lisp
pact> (or (> 5 3) (< 2 4))
true

pact> (or (< 5 3) (> 4 2))
true
```

### Short-Circuit Behavior

```lisp
pact> (or true (/ 1 0))
true
```

In this example, `(/ 1 0)` is not evaluated because the first argument is `true`, avoiding a division by zero error.

## Notes

- The `or` operator can be used with more than two arguments, e.g., `(or x y z)`. In this case, it returns `true` if any of the arguments are `true`.
- When used with non-boolean values, Pact considers `false` and `null` as falsy, and all other values as truthy.

## See Also

- [and](and.md): Logical AND operator
- [not](not.md): Logical NOT operator
