
#!/bin/bash

usage() {
  echo "Usage: $0 [-p pattern] [-f file] [-d directory]"
  echo "  -p pattern     Run tests matching the whole word."
  echo "  -f file        Run specific test file."
  echo "  -d directory   Run tests in specific directory."
  exit 
}

DEFAULT_COMMAND="npx mocha --reporter mochawesome --showFailed --exit './mocha/**/*.test.js'"
COMMAND="npx mocha"

PATTERN=""
FILE=""
DIRECTORY=""

while getopts "p:f:d:e:" opt; do
  case ${opt} in
    p)
      PATTERN="-g \"/\\b${OPTARG}\\b/\""
      ;;
    f)
      FILE="./mocha/**/${OPTARG}"
      ;;
    d)
      DIRECTORY="./mocha/${OPTARG}/**/*.test.js"
      ;;
    *)
      usage
      ;;
  esac
done

if [ -n "$FILE" ] && [ -n "$DIRECTORY" ]; then
  echo "Error: You can specify either a file or a directory, but not both."
  usage
fi

if [ -n "$DIRECTORY" ]; then
  COMMAND="$COMMAND $DIRECTORY"
elif [ -n "$FILE" ]; then
  COMMAND="$COMMAND $FILE"
else
  COMMAND="$COMMAND './mocha/**/*.test.js'"
fi

if [ -n "$PATTERN" ]; then
  COMMAND="$COMMAND $PATTERN"
fi

if [ -z "$PATTERN" ] && [ -z "$FILE" ] && [ -z "$DIRECTORY" ]; then
  COMMAND="$DEFAULT_COMMAND"
fi

echo "Running command: $COMMAND"
eval $COMMAND