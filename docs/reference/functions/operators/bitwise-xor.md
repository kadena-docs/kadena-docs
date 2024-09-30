# Bitwise XOR Operator (xor)

The bitwise XOR (exclusive OR) operator (`xor`) in Pact performs a bitwise XOR operation on two integers.

## Syntax

```lisp
(xor x y)
```

## Parameters

- `x`: First integer operand
- `y`: Second integer operand

## Return Value

Returns the result of performing a bitwise XOR operation on `x` and `y`.

## Examples

### Basic Usage

```lisp
pact> (xor 5 3)
6

pact> (xor 255 170)
85

pact> (xor 5 5)
0
```

### Binary Representation

To better understand the operation, let's look at the binary representation:

```lisp
pact> (xor 5 3)
6
; Binary representation:
; 5   = 0101
; 3   = 0011
; xor = 0110 (6 in decimal)

pact> (xor 5 -7)
-4
; Binary representation (using 8-bit integers for simplicity):
; 5   = 00000101
; -7  = 11111001 (two's complement)
; xor = 11111100 (-4 in decimal, two's complement)
```

## Notes

- The bitwise XOR operation is performed on the binary representation of the integers.
- For each bit position, the result is 1 if the bits in the operands are different, otherwise it's 0.
- XOR has some interesting properties:
  - `x xor x = 0` for any `x`
  - `x xor 0 = x` for any `x`
  - `x xor -1 = ~x` (bitwise NOT of x)
- When working with negative numbers, be aware that they are represented using two's complement.

## See Also

- [&](bitwise-and.md): Bitwise AND operator
- [|](bitwise-or.md): Bitwise OR operator
- [~](bitwise-not.md): Bitwise NOT operator
