.PHONY: build dev todos

build:
	@echo "Building all snippets..."
	@bun build.ts

todos:
	@echo "Checking for TODOs and FIXMEs in TypeScript..."
	@rg --line-number --no-heading "(TODO|FIXME)" --type ts || echo "No TODOs or FIXMEs found"
	@echo "Type-checking TypeScript..."
	@bunx tsc --noEmit
	@echo "Running build..."
	@bun build.ts
