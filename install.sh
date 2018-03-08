#!/bin/bash

CCYAN=$(printf '\033[0;36m')
CGREEN=$(printf '\033[0;32m')
CBLUE=$(printf '\033[0;34m')
CGRAY=$(printf '\033[1;30m')
CRED=$(printf '\033[0;31m')
CPURPLE=$(printf '\033[0;35m')

JS_CLIENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}")/src" && pwd )"
REFAPP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}")/apps/reference" && pwd )"
SIMPLE_APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}")/apps/hello" && pwd )"
echo "$REFAPP_DIR"


client_install() {
 echo "${CCYAN}Installing stride NodeJS client packages.."
 cd "$JS_CLIENT_DIR" && npm i
 echo "Done with installation for stride packages"

}

reference_install() {
echo "${CBLUE} Installing reference application packages.."
cd "$REFAPP_DIR" && npm i
 echo "Done with installation for reference app packages"
}

hello_install() {
echo "${CGREEN}Installing hello application packages.."
cd "$SIMPLE_APP_DIR" && npm i
 echo "Done with installation for hello app packages"
}

main() {

echo "<${CPURPLE}=====Beginning installation of packages=======>"
printf "\n"

client_install
reference_install
hello_install

printf "\n"
echo "${CPURPLE}<=====Successfully completed installation=======>"

}

main