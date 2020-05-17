pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; // 100 tokens per ether

    constructor(Token _token) public {
        token = _token;
    }

    event TokensPurchased (
      address account,
      address token,
      uint amount,
      uint rate
    );

    event TokensSold (
      address account,
      address token,
      uint amount,
      uint rate
    );

    function  buyTokens() public payable {
        // Canculate the number of Tokens to buy
        uint tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount, "Insufficient Exchange Tokens to purchase");

        token.transfer(msg.sender,tokenAmount);

        // Emit a TokensPurchase event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {

        require(token.balanceOf(msg.sender) >= _amount, "Insufficient Tokens");
        // Calculate the Amount of Ether to redeem for the tokens received
        uint etherAmount = _amount / rate;
        uint balance = address(this).balance;

        require(balance >= etherAmount, "Insufficient Ether to purchase Tokens");
        // Sell Tokens
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
        // Emit a TokensSold event
        emit TokensSold(msg.sender, address(token), _amount, rate);
   }
}