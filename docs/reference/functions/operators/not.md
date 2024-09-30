# Logical NOT Operator (not)

The logical NOT operator (`not`) in Pact performs a boolean negation operation.

## Syntax

```lisp
(not x)
```

## Parameters

- `x`: Boolean expression to negate

## Return Value

Returns `true` if `x` is `false`, and `false` if `x` is `true`.

## Examples

### Basic Usage

```lisp
pact> (not true)
false

pact> (not false)
true
```

### With Expressions

```lisp
pact> (not (> 5 3))
false

pact> (not (< 5 3))
true
```

### Combining with Other Logical Operators

```lisp
pact> (not (and true false))
true

pact> (not (or false false))
true
```

## Notes

- When used with non-boolean values, Pact considers `false` and `null` as falsy, and all other values as truthy.
- The `not` operator can be useful for inverting conditions in control flow statements.

## See Also

- [and](and.md): Logical AND operator
- [or](or.md): Logical OR operator
