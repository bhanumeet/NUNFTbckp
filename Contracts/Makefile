-include .env

deploy:
	forge create --rpc-url "http://127.0.0.1:8545" --private-key ${ANVIL_0_PRIVATE_KEY} ./src/Token.sol:Token

deploy holskey:
	forge create --rpc-url ${HOLSKEY_RPC_URL} --private-key ${RAX_PRIVATE_KEY} ./src/Token.sol:Token

token abi:
	forge build && jq '.abi' ./out/Token.sol/Token.json > ./Token.abi.json