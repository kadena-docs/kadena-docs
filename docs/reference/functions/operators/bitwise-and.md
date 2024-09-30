# Bitwise AND Operator (&)

The bitwise AND operator (`&`) in Pact performs a bitwise AND operation on two integers.

## Syntax

```lisp
(& x y)
```

## Parameters

- `x`: First integer operand
- `y`: Second integer operand

## Return Value

Returns the result of performing a bitwise AND operation on `x` and `y`.

## Examples

### Basic Usage

```lisp
pact> (& 3 1)
1

pact> (& 5 3)
1

pact> (& 255 170)
170
```

### Binary Representation

To better understand the operation, let's look at the binary representation:

```lisp
pact> (& 2 3)
2
; Binary representation:
; 2 = 0010
; 3 = 0011
; & = 0010 (2 in decimal)

pact> (& 5 -7)
1
; Binary representation (using 8-bit integers for simplicity):
; 5   = 00000101
; -7  = 11111001 (two's complement)
; &   = 00000001 (1 in decimal)
```

## Notes

- The bitwise AND operation is performed on the binary representation of the integers.
- For each bit position, the result is 1 if both operands have 1 in that position, otherwise it's 0.
- When working with negative numbers, be aware that they are represented using two's complement.

## See Also

- [|](bitwise-or.md): Bitwise OR operator
- [~](bitwise-not.md): Bitwise NOT operator
- [xor](bitwise-xor.md): Bitwise XOR operator

