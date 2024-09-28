!#/bin/bash
if pnpm add-migration | grep "No schema changes, nothing to migrate"; then
	echo "Migrations OK"
else
	echo "Migrations Missing"
	exit 1
fi
