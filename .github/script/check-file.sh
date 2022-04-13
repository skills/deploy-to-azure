#!/usr/bin/env bash
# Make sure this file is executable
# chmod a+x .github/script/check-file.sh

# Make sure to escape your backslashes => \\ <= in YAML
# So that its still a single \ in bash

grep_pattern() {
  echo
  echo "Check that $1 includes $2"
  if grep --extended-regexp "$2" -- $1
  then
    echo "Found $2 in $1"
  else
    echo "Missing $2 in $1"
    echo "----------------"
    echo "$(cat $1)"
    exit 204  # We're sending a weird code so it looks different from other "failures"
  fi
}

search_list() {
  for pattern in "$@"
  do
      grep_pattern $FILE $pattern
  done
}

if [ -n "${SEARCH+set}" ] && [ -n "${FILE+set}" ]; then
  grep_pattern $FILE $SEARCH
elif [ -n "${SEARCH_LIST+set}" ] && [ -n "${FILE+set}" ]; then
  search_list $SEARCH_LIST
else
  echo "FILE and (SEARCH | SEARCH_LIST) required"
fi





