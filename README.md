# 4-Bit Synthesizable ALU

A 4-bit Arithmetic Logic Unit (ALU) written in SystemVerilog. It handles basic arithmetic and bitwise logic operations using a 3-bit opcode selector. The logic is fully combinational and structured to prevent latch inference.

## Supported Operations

The module decodes the 3-bit `opcode` as follows:

| Opcode | Operation | Function |
| :--- | :--- | :--- |
| `3'b000` | ADD | `A + B` (Updates carry flag) |
| `3'b001` | SUB | `A - B` (Updates carry/borrow flag) |
| `3'b010` | AND | Bitwise AND (`A & B`) |
| `3'b011` | OR | Bitwise OR (`A | B`) |
| `3'b100` | XOR | Bitwise XOR (`A ^ B`) |
| `3'b101` | NOT | Bitwise NOT (`~A`) |

## Implementation Details

* **Latch Prevention:** Default assignments are set for `temp`, `carry`, and `result` at the beginning of the `always` block to ensure a pure combinational circuit.
* **Carry Generation:** A 5-bit internal register (`temp`) is used during addition and subtraction to capture the overflow bit and drive the `carry` output.

## Files

* `design.sv` - Main ALU implementation.
* `testbench.sv` - Test stimulus and verification.

## Simulation

To compile and run the simulation using Icarus Verilog:

```bash
# Compile design and testbench
iverilog -g2012 -o alu_sim design.sv testbench.sv

# Run simulation
vvp alu_sim
