# Logical AND Operator (and)

The logical AND operator (`and`) in Pact performs a boolean AND operation with short-circuit evaluation.

## Syntax

```lisp
(and x y)
```

## Parameters

- `x`: First boolean expression
- `y`: Second boolean expression

## Return Value

Returns `true` if both `x` and `y` are `true`, `false` otherwise.

## Short-Circuit Evaluation

The `and` operator uses short-circuit evaluation, meaning that if `x` is `false`, `y` is not evaluated, and the result is immediately `false`.

## Examples

### Basic Usage

```lisp
pact> (and true true)
true

pact> (and true false)
false

pact> (and false true)
false

pact> (and false false)
false
```

### With Expressions

```lisp
pact> (and (> 5 3) (< 2 4))
true

pact> (and (> 5 3) (< 4 2))
false
```

### Short-Circuit Behavior

```lisp
pact> (and false (/ 1 0))
false
```

In this example, `(/ 1 0)` is not evaluated because the first argument is `false`, avoiding a division by zero error.

## Notes

- The `and` operator can be used with more than two arguments, e.g., `(and x y z)`. In this case, it returns `true` only if all arguments are `true`.
- When used with non-boolean values, Pact considers `false` and `null` as falsy, and all other values as truthy.

## See Also

- [or](or.md): Logical OR operator
- [not](not.md): Logical NOT operator
