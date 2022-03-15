#!/bin/bash

echo "Working directory: $(pwd)"

# Create a sed script-file for replacing "___ENV_VARS___" with "$ENV_VARS"
# so that they can be replaced by the 'envsubst' program.
touch /.env.sed
variable_names=$(grep "^[^#]" /.env | cut -f1 -d= | xargs)
for v in $variable_names; do
  echo "s/___${v}___/\\\$${v}/g" >> /.env.sed
done

# Replace the variables with the actual environment variables
echo "Substituting variables"
shopt -s globstar
subst_variables=$(grep "^[^#]" /.env | cut -f1 -d= | xargs -I {} printf "\${} " | xargs)
for f in ./**/*.js; do
  sed -i -f /.env.sed "$f"
  envsubst "$subst_variables" < "$f" > "$f.substituted"
  mv -v "$f.substituted" "$f"
done

echo "Starting nginx"
nginx -g 'daemon off;'
