module alu_4bit(
  input [3:0] A,
  input [3:0] B,
  input [2:0] opcode,
  output reg carry_out,
  output reg [4:0] result
);

  reg [4:0] temp;

  
  always @(*) begin
    temp  = 0;
    carry_out = 0;
    result = 0; 
    
   
    case(opcode) 
      3'b000: begin
        temp   = A + B;
        result = temp;
        carry_out  = temp[4];
      end
      
      3'b001: begin
        temp   = A - B;
        result = temp;
        carry_out  = temp[4];
      end
      
      3'b100: result = A ^ B; // Fixed 3'100 to 3'b100
      3'b010: result = A & B;
      3'b101: result = ~A;
      3'b011: result = A | B;
      
      default: result = 0;   
    endcase
  end 

endmodule
    
  
  
  