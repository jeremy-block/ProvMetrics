# Test data overview

Here are some details about the designed data files in this folder:

## File names and properties

1. **Nuller** - 2 events - no interactions just click end study.
2. Distracted - Mistake and misclick file where multiple interactions happen back to back but should be grouped together.
3. Repeat Searcher - 3 searches repeated with some interactions between searches.
4. Repeat Reader - Reading the same document multiple times.
5. Repeat Lexicaler - Searching for 3 topics based on the topic's synonyms.
6. **Fixated** - Does multiple searches and focuses on one topic.
7. **Explorer** - Open every document - should be 100% exploration.
8. **Digger** - Does a search for 'arms' and reads every document (27) related to that term.
9. **Inefficient Queryer** - Search results return either 0 results or 1 result
10. **Maximal Queryer** - search results return almost all the results.
11. **Efficient Queryer** - search results return 5 to 10 results.
12. **Cycler** - Opens and closes the same 5 documents 3 times.
13. **Non-cycler** - opens 15 different topic documents
14. **Burster** - Run's the same query over and over again. 3 in rapid succession, and 3 with some time between events.
15. **Irrelevanter** - Only searching for terms un-related to the challenge.

Most of the data has not been created at this time. Bolded titles exist in the `interactions` folder.
