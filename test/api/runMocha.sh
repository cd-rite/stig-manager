
#!/bin/bash

usage() {
  echo "Usage: $0 [-p pattern ...] [-f file ...] [-d directory ...] [-u user_level ...]"
  echo "  -p pattern     Run tests matching the whole word."
  echo "  -f file        Run specific test file."
  echo "  -d directory   Run tests in specific directory."
  echo "  -u user        Run tests for specific user or list of users."
  exit 
}

DEFAULT_COMMAND="npx mocha --reporter mochawesome --showFailed --exit './mocha/**/*.test.js'"
COMMAND="npx mocha --reporter mochawesome --showFailed --exit"

PATTERNS=()
FILES=()
DIRECTORIES=()
USERS=()

while getopts "p:f:d:u:" opt; do
  case ${opt} in
    p)
      PATTERNS+=("${OPTARG}")
      ;;
    f)
      FILES+=("./mocha/**/${OPTARG}")
      ;;
    d)
      DIRECTORIES+=("${OPTARG}")
      ;;
    u)
      USERS+=("${OPTARG}")
      ;;
    *)
      usage
      ;;
  esac
done

if [ ${#FILES[@]} -gt 0 ] && [ ${#DIRECTORIES[@]} -gt 0 ]; then
  echo "Error: You can specify either files or directories, but not both."
  usage
fi

if [ ${#DIRECTORIES[@]} -gt 0 ]; then
  COMMAND+=" ${DIRECTORIES[*]}"
elif [ ${#FILES[@]} -gt 0 ]; then
  COMMAND+=" ${FILES[*]}"
else
  COMMAND+=" './**/*.test.js'"
fi

GREP_PATTERN=""
if [ ${#USERS[@]} -gt 0 ]; then
  USER_PATTERN=$(IFS='|'; echo "${USERS[*]}")
  GREP_PATTERN="\\buser:(${USER_PATTERN})\\b"
fi

if [ ${#PATTERNS[@]} -gt 0 ]; then
  PATTERN_STRING=$(IFS='|'; echo "${PATTERNS[*]}")
  GREP_PATTERN="${GREP_PATTERN:+$GREP_PATTERN.*}\\b(${PATTERN_STRING})\\b"
fi

if [ -n "$GREP_PATTERN" ]; then
  COMMAND+=" -g \"/$GREP_PATTERN/\""
fi

if [ ${#PATTERNS[@]} -eq 0 ] && [ ${#FILES[@]} -eq 0 ] && [ ${#DIRECTORIES[@]} -eq 0 ] && [ ${#USERS[@]} -eq 0 ]; then
  COMMAND="$DEFAULT_COMMAND"
fi

echo "Running command: $COMMAND"
eval $COMMAND