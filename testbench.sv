`timescale 1ns/1ps

module tb_alu_4bit;

  reg  [3:0] A, B;
    reg  [2:0] opcode;
    wire [3:0] result;
    wire       carry_out;

  alu_4bit uut (.A(A), .B(B), .opcode(opcode), .result(result), .carry_out(carry_out));

    initial begin
        A = 4'd5;  B = 4'd3;  opcode = 3'b000; #10;
        $display("ADD: %0d + %0d = %0d, carry=%b", A, B, result, carry_out);

        A = 4'd15; B = 4'd1;  opcode = 3'b000; #10;
        $display("ADD: %0d + %0d = %0d, carry=%b", A, B, result, carry_out);

        A = 4'd7;  B = 4'd3;  opcode = 3'b001; #10;
        $display("SUB: %0d - %0d = %0d, carry=%b", A, B, result, carry_out);

        A = 4'b1100; B = 4'b1010; opcode = 3'b010; #10;
        $display("AND: %b & %b = %b", A, B, result);

        A = 4'b1100; B = 4'b1010; opcode = 3'b011; #10;
        $display("OR:  %b | %b = %b", A, B, result);

        A = 4'b1100; B = 4'b1010; opcode = 3'b100; #10;
        $display("XOR: %b ^ %b = %b", A, B, result);

        A = 4'b1010; opcode = 3'b101; #10;
        $display("NOT: ~%b = %b", A, result);

        $finish;
    end

endmodule
  
  
  
