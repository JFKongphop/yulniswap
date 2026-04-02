call:
	node shortcuts/call.js

t:
	npx hardhat test

deploy:
	npx hardhat run --network ${chain} scripts/deploy.ts

ce2:
	node compiler/solc.js v2/ERC20

te2:
	make ce2 && npx hardhat test test/erc20.ts