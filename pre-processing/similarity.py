import spacy

# Smaller functio nto compare two words and get their similarity.
def calculate_word_similarity(word1, word2, nlp):
    doc1 = nlp(word1)
    doc2 = nlp(word2)
    similarity = doc1.similarity(doc2)
    if isDebug:
        print("similarity between", word1, word2, "is", similarity)
    return similarity

# Main functio nthat takes a list and calculates the average similarity of the pairwise comparison of terms in the list.
def calculate_similarity_score(word_list):
    nlp = spacy.load('en_core_web_lg')
    # words = word_list.split(',')
    if isDebug:
        print("spilt words", word_list)
    num_words = len(word_list)

    if num_words <= 1:
        return 1

    total_similarity = 0

    for i in range(num_words - 1):
        for j in range(i + 1, num_words):
            similarity = calculate_word_similarity(word_list[i], word_list[j], nlp)
            total_similarity += similarity

    average_similarity = total_similarity / ((num_words * (num_words - 1)) / 2)

    return average_similarity

if __name__ == "__main__":
    import sys

    # Read the word list from standard input
    word_list = sys.argv[1:]
    if word_list[0] == "_debug_":
        isDebug = True
        word_list = word_list[1:]
    else:
        isDebug = False

    if isDebug:
        print("word list", word_list)
    # cleanedWords = convert_to_list(word_list)
    # input_type, parsed_input = determine_input_type(word_list)

    similarity_score = calculate_similarity_score(word_list)

    if isDebug:
        print("Similarity score:", similarity_score)
    else:
        print(similarity_score)

    sys.stdout.flush()



## The items below are for cleaning up arguments passed to the python file. Not used because they are not needed if I control the use of this function.

# def convert_to_list(argument):
#     # If the argument contains a comma, split it by comma and return as a list
#     if ',' in argument:
#         return argument.split(',')
    
#     # If the argument contains a space, split it by space and return as a list
#     elif ' ' in argument:
#         return argument.split()
    
#     # If the argument is a single value, return it as a list
#     else:
#         return argument


# def determine_input_type(argument):
#     import json
#     import re
#     # Check if the argument matches a JSON array structure
#     try:
#         parsed_input = json.loads(argument)
#         return "JSON array", parsed_input
#     except json.JSONDecodeError:
#         pass
    
#     # Check if the argument matches a list-like structure with comma separation
#     if re.match(r'^\[(.*)\]$', argument):
#         parsed_input = re.findall(r'\b\w+\b', argument)
#         return "list", parsed_input
    
#     # If none of the above, treat it as a single value
#     return "single value", [argument]