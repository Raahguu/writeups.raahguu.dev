#!/bin/bash
for dir in $(find _writeups -type d); do
	if [ "$dir" == "_writeups" ]; then
		continue
	fi
	echo "---" > "$dir/index.md"
	echo "layout: writeup-index" >> "$dir/index.md"
	echo "permalink: /${dir#_writeups/}/" >> "$dir/index.md"
	echo "---" >> "$dir/index.md"
done
