import re

def extract_urls_from_file(contents):
    urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', contents)
    return urls

def remove_text_before_marker(contents, marker="\n1. "):
    position = contents.find(marker)
    if position != -1:
        return contents[position:]
    return contents

def extract_and_remove_outermost_brackets(contents):
    start, end, stack = -1, -1, []
    bracket_texts = {}

    for i, char in enumerate(contents):
        if char == '(':
            stack.append(i)
            if start == -1:  # beginning of an outermost bracket
                start = i
        elif char == ')':
            if stack:
                stack.pop()
            if not stack and start != -1:  # end of an outermost bracket
                end = i
                key = contents[:start].strip()
                value = contents[start + 1:end]
                bracket_texts[key] = value
                contents = contents[:start] + contents[end + 1:]
                start, end = -1, -1
                break  # We break after one iteration since the contents has been modified

    return bracket_texts, contents




def main():
    filename = input("Enter the name of the target file: ")
    
    with open(filename, 'r') as file:
        contents = file.read()

    # Extract URLs from the original content
    urls = extract_urls_from_file(contents)
    
    if urls:
        print("\nURLs found in the content:")
        for url in urls:
            print(url)
    else:
        print("\nNo URLs found in the content.")

    # Remove text before the marker
    modified_contents = remove_text_before_marker(contents)

    # Extract and remove texts between brackets
    extracted_data = {}
    while True:
        bracket_texts, modified_contents = extract_and_remove_outermost_brackets(modified_contents)
        
        if not bracket_texts:
            break

        extracted_data.update(bracket_texts)
        
    if extracted_data:
        print("\nExtracted texts between outermost brackets:")
        for key, value in extracted_data.items():
            print(f"Key: '{key}'\nValue: '{value}'\n")
    else:
        print("\nNo text found between outermost brackets in the modified content.")
        
    print("\nModified Content after removing bracket texts:")
    print(modified_contents)



if __name__ == '__main__':
    main()
