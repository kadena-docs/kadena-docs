# Bitwise OR Operator (|)

The bitwise OR operator (`|`) in Pact performs a bitwise OR operation on two integers.

## Syntax

```lisp
(| x y)
```

## Parameters

- `x`: First integer operand
- `y`: Second integer operand

## Return Value

Returns the result of performing a bitwise OR operation on `x` and `y`.

## Examples

### Basic Usage

```lisp
pact> (| 1 2)
3

pact> (| 5 3)
7

pact> (| 240 15)
255
```

### Binary Representation

To better understand the operation, let's look at the binary representation:

```lisp
pact> (| 2 3)
3
; Binary representation:
; 2 = 0010
; 3 = 0011
; | = 0011 (3 in decimal)

pact> (| 5 -7)
-3
; Binary representation (using 8-bit integers for simplicity):
; 5   = 00000101
; -7  = 11111001 (two's complement)
; |   = 11111101 (-3 in decimal, two's complement)
```

## Notes

- The bitwise OR operation is performed on the binary representation of the integers.
- For each bit position, the result is 1 if either operand has 1 in that position, otherwise it's 0.
- When working with negative numbers, be aware that they are represented using two's complement.

## See Also

- [&](bitwise-and.md): Bitwise AND operator
- [~](bitwise-not.md): Bitwise NOT operator
- [xor](bitwise-xor.md): Bitwise XOR operator
