install-no-cache:
	rm -rf .yarn/cache
	rm -rf .yarn/unplugged
	rm .yarn/build-state.yml
	rm .yarn/install-state.gz
	rm .pnp.js
	yarn install

upgrade-all:
	yarn set version latest
	yarn dlx npm-check-updates --dep dev,prod --upgrade
	yarn dlx @yarnpkg/pnpify --sdk
	yarn install
