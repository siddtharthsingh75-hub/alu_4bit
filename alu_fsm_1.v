// ============================================================
// Parameterized FSM-Controlled ALU with Approximate Computing
// ============================================================

module alu_fsm #(
    parameter WIDTH = 8
)(
    input  wire             clk,
    input  wire             rst,
    input  wire             start,
    input  wire [2:0]       op,
    input  wire [WIDTH-1:0] a,
    input  wire [WIDTH-1:0] b,
    output reg  [WIDTH-1:0] result,
    output reg              done
);

// ----- Operation codes -----
localparam OP_ADD    = 3'd0;
localparam OP_SUB    = 3'd1;
localparam OP_AND    = 3'd2;
localparam OP_OR     = 3'd3;
localparam OP_XOR    = 3'd4;
localparam OP_APPROX = 3'd5;

// ----- HALF must be a localparam so part selects are constant -----
localparam HALF = WIDTH / 2;

// ----- FSM states -----
localparam IDLE    = 2'd0;
localparam EXECUTE = 2'd1;
localparam DONE    = 2'd2;

reg [1:0] state, next_state;

// ----- Approximate Adder -----
// Upper half: exact addition
// Lower half: OR approximation (cheap, small error)
function [WIDTH-1:0] approx_add;
    input [WIDTH-1:0] x, y;
    begin
        approx_add = {
            x[WIDTH-1:HALF] + y[WIDTH-1:HALF],
            x[HALF-1:0] | y[HALF-1:0]
        };
    end
endfunction

// ----- FSM: state register -----
always @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;
    else     state <= next_state;
end

// ----- FSM: next state logic -----
always @(*) begin
    case (state)
        IDLE:    next_state = start ? EXECUTE : IDLE;
        EXECUTE: next_state = DONE;
        DONE:    next_state = IDLE;
        default: next_state = IDLE;
    endcase
end

// ----- FSM: output logic -----
always @(posedge clk or posedge rst) begin
    if (rst) begin
        result <= 0;
        done   <= 0;
    end else begin
        done <= 0;
        case (state)
            EXECUTE: begin
                case (op)
                    OP_ADD:    result <= a + b;
                    OP_SUB:    result <= a - b;
                    OP_AND:    result <= a & b;
                    OP_OR:     result <= a | b;
                    OP_XOR:    result <= a ^ b;
                    OP_APPROX: result <= approx_add(a, b);
                    default:   result <= 0;
                endcase
            end
            DONE: done <= 1;
        endcase
    end
end

endmodule
