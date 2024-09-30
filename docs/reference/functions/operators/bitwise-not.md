# Bitwise NOT Operator (~)

The bitwise NOT operator (`~`) in Pact performs a bitwise NOT operation (also known as one's complement) on an integer.

## Syntax

```lisp
(~ x)
```

## Parameters

- `x`: Integer operand

## Return Value

Returns the result of performing a bitwise NOT operation on `x`.

## Examples

### Basic Usage

```lisp
pact> (~ 5)
-6

pact> (~ -1)
0

pact> (~ 0)
-1
```

### Binary Representation

To better understand the operation, let's look at the binary representation:

```lisp
pact> (~ 5)
-6
; Binary representation (using 8-bit integers for simplicity):
; 5    = 00000101
; ~5   = 11111010 (-6 in decimal, two's complement)

pact> (~ -6)
5
; Binary representation (using 8-bit integers for simplicity):
; -6   = 11111010 (two's complement)
; ~(-6)= 00000101 (5 in decimal)
```

## Notes

- The bitwise NOT operation inverts all bits in the binary representation of the integer.
- In two's complement representation (used for signed integers), `~x` is equivalent to `-x - 1`.
- When working with negative numbers, be aware that they are represented using two's complement.

## See Also

- [&](bitwise-and.md): Bitwise AND operator
- [|](bitwise-or.md): Bitwise OR operator
- [xor](bitwise-xor.md): Bitwise XOR operator

