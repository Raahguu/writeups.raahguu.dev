#!/bin/bash
for dir in $(find _writeups -type d); do
    if [ "$dir" == "_writeups" ]; then
        continue
    fi

    # Remove leading _writeups/ and split into array
    relative_path="${dir#_writeups/}"
    IFS='/' read -ra parts <<< "$relative_path"
    len=${#parts[@]}

    # Determine title parts
    if [ $len -ge 2 ]; then
        second_last="${parts[len-2]}"
        last="${parts[len-1]}"
        if [ "$second_last" == "_writeups" ]; then
            title_raw="$last"
        else
            title_raw="$last $second_last"
        fi
    else
        title_raw="${parts[0]}"
    fi

    # Dash substitution logic
    title="${title_raw//\\-/PLACEHOLDERDASH}"
    title="${title//-/ }"
    title="${title//PLACEHOLDERDASH/-}"

    index_file="$dir/index.md"

    # Preserve lines from 6 onward if the file exists
    if [ -f "$index_file" ]; then
        tail -n +6 "$index_file" > "$index_file.tmp.rest"
    else
        touch "$index_file.tmp.rest"
    fi

    # Write the updated front matter
    {
        echo "---"
        echo "layout: writeup-index"
        echo "permalink: /${relative_path}/"
        echo "title: $title Writeups"
        echo "---"
        cat "$index_file.tmp.rest"
    } > "$index_file"

    rm "$index_file.tmp.rest"
done
