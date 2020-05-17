const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require ('chai')
.use(require('chai-as-Promised'))
.should()

function tokens(n){
    let tokens = n.toString()
    return web3.utils.toWei(tokens, 'ether')
}

contract('EthSwap', ([deployer,investor]) => {
    console.log('** EthSwap() deployer = '+deployer+' investor = '+investor)
    let token, ethSwap, millionTokens
    
    before(async () => {
        console.log('before() START **********************************************************************')
        console.log('**deployer Address = '+deployer)
        console.log('**investor Address = '+investor)
        millionTokens = tokens(1000000)
        token = await Token.new()
        console.log('** before() Token Address = '+token.address)
        ethSwap = await EthSwap.new(token.address)
        let balance = await token.balanceOf(ethSwap.address)
        console.log('** before() EthSwap Address = '+ethSwap.address+' Balance = '+balance)
        // Transfer all Tokens to EthSwap
        console.log('** before() Token.transfer('+ethSwap.address+", "+millionTokens+')')
        await token.transfer(ethSwap.address, millionTokens);
        balance = await token.balanceOf(ethSwap.address);
        console.log('** before() Token Transfered('+ethSwap.address+", balance = "+balance+')')
        console.log('before() END **********************************************************************')
    })

    describe('Token deploment', async () => {
        it('Contract has a name', async () => {
            const name = await token.name()
            console.log('** Contract token.address = '+token.address)
            console.log("name = "+name)
            assert.equal(name, 'DApp Token')
        })
        console.log('Token deploment END **********************************************************************')
    })

    describe('EthSwap deploment', async () => {
        it('Contract has a name', async () => {
            const name = await ethSwap.name()
            console.log('** Contract ethSwap.address = '+ethSwap.address)
            console.log("name = "+name)
            assert.equal(name, 'EthSwap Instant Exchange')
            console.log('EthSwap deploment END **********************************************************************')
        })

        it('EthSwap Contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            console.log("** Name ethSwap.address = "+ethSwap.address+" Balance = "+balance.toString())
            console.log('millionTokens = '+millionTokens)
            assert.equal(balance.toString(), millionTokens)
            console.log('EthSwap Contract has tokens END **********************************************************************')
        })
    })

    describe('buyTokens()', async () => {
        let val, ethSwapTokenBalance, investorTokenBalance, ethSwapEtherBalance, investorEtherBalance, result
        val = web3.utils.toWei('1', 'ether');
        before(async () => {
            ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            investorTokenBalance = await token.balanceOf(investor)
            investorEtherBalance = await web3.eth.getBalance(investor)
            console.log("** BEFORE EthSwap  Address       = "+ethSwap.address)
            console.log("** BEFORE EthSwap  Token balance = "+ethSwapTokenBalance)
            console.log("** BEFORE EthSwap  Ether balance = "+ethSwapEtherBalance)
            console.log("** BEFORE Investor Address       = "+investor)
            console.log("** BEFORE Investor Token balance = "+investorTokenBalance)
            console.log("** BEFORE Investor Ether balance = "+investorEtherBalance)
            console.log("** EXECUTING ethSwap.buyTokens({from: "+investor+" value: "+val+"})")
            result = await ethSwap.buyTokens({from: investor, value: val })
            console.log("** EXECUTED ethSwap.buyTokens({from: "+investor+" value: "+val+"})")
        })
        it('Allows user to instantly buy tokens for EthSwap for a fixed price', async () => {
            ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            investorTokenBalance = await token.balanceOf(investor)
            investorEtherBalance = await web3.eth.getBalance(investor)
            console.log("** BEFORE EthSwap  Address       = "+ethSwap.address)
            console.log("** BEFORE EthSwap  Token balance = "+ethSwapTokenBalance)
            console.log("** BEFORE EthSwap  Ether balance = "+ethSwapEtherBalance)
            console.log("** BEFORE Investor Address       = "+investor)
            console.log("** BEFORE Investor Token balance = "+investorTokenBalance)
            console.log("** BEFORE Investor Ether balance = "+investorEtherBalance)
            assert.equal(investorTokenBalance.toString(), tokens(100))
            assert.equal(ethSwapTokenBalance.toString(), tokens(999900))
            assert.equal(ethSwapEtherBalance.toString(),  web3.utils.toWei('1','Ether'))

            console.log(result.logs[0].args)

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount, tokens(100))
            assert.equal(event.rate, 100)
        })
    })

    describe('sellTokens()', async () => {
        let val, ethSwapTokenBalance, investorTokenBalance, ethSwapEtherBalance, investorEtherBalance, result
        val = web3.utils.toWei('1', 'ether');
        before(async () => {
            ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            investorTokenBalance = await token.balanceOf(investor)
            investorEtherBalance = await web3.eth.getBalance(investor)
            console.log("** BEFORE EthSwap  Address       = "+ethSwap.address)
            console.log("** BEFORE EthSwap  Token balance = "+ethSwapTokenBalance)
            console.log("** BEFORE EthSwap  Ether balance = "+ethSwapEtherBalance)
            console.log("** BEFORE Investor Address       = "+investor)
            console.log("** BEFORE Investor Token balance = "+investorTokenBalance)
            console.log("** BEFORE Investor Ether balance = "+investorEtherBalance)
             // Investor must approve the tokens prior to selling
             console.log("** EXECUTING ethSwap.approve("+ethSwap.address+", "+tokens('100')+", {from: "+investor+"})")
             await token.approve(ethSwap.address, tokens('100'), { from: investor });
             console.log("** EXECUTING ethSwap.sellTokens("+ethSwap.address+", "+tokens('100')+", {from: "+investor+"})")
             // Investor can now sell tokens
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })
         })
        it('Allows user to instantly sell tokens to EthSwap for a fixed price', async () => {
            ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
            ethSwapEtherBalance = await web3.eth.getBalance(ethSwap.address)
            investorTokenBalance = await token.balanceOf(investor)
            investorEtherBalance = await web3.eth.getBalance(investor)
            console.log("** AFTER EthSwap  Address       = "+ethSwap.address)
            console.log("** AFTER EthSwap  Token balance = "+ethSwapTokenBalance)
            console.log("** AFTER EthSwap  Ether balance = "+ethSwapEtherBalance)
            console.log("** AFTER Investor Address       = "+investor)
            console.log("** AFTER Investor Token balance = "+investorTokenBalance)
            console.log("** AFTER Investor Ether balance = "+investorEtherBalance)
            assert.equal(investorTokenBalance.toString(), tokens(0))
            assert.equal(ethSwapTokenBalance.toString(), tokens(1000000))
            assert.equal(ethSwapEtherBalance.toString(),  web3.utils.toWei('0','Ether'))

            console.log(result.logs[0].args)

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token,token.address)
            assert.equal(event.amount, tokens(100))
            assert.equal(event.rate, 100)

            // FALURE: Investor can't sell more tokens than they have
           try {
                await ethSwap.sellTokens(tokens('500'), { from: investor}) //.shound.be.rejected;
                throw null;
            }
            catch (error) {
                assert(error, "Expected an error but did not get one");
                console.log("**ERR** SUCCESSFULLY CAUGHT: "+ error.message);
            }
        })
    })
})