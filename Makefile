init:
	npm install
login:
	node_modules/.bin/clasp login

create_sheet:
	node_modules/.bin/clasp create

webpack:
	npm run build:webpack

deploy:
	cd dist && ../node_modules/.bin/clasp push

deploy-demo:
	cp -r dist/* demo
	cd demo && ../node_modules/.bin/clasp push
