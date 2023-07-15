# Metric Descriptions

Below you can find a description for each metric as well as some comments about how it is calculated.

- [Metric Descriptions](#metric-descriptions)
  - [Count Interactions - 0.1 - 06/29/2023](#count-interactions---01---06292023)
  - [Ratio Interactions - 0.1 - 06/29/2023](#ratio-interactions---01---06292023)
  - [Norm Interactions - 0.1 - 07/14/2023](#norm-interactions---01---07142023)
  - [total\_interaction\_count - 0.1 - 06/29/2023](#total_interaction_count---01---06292023)
  - [total\_duration - 0.1 - 06/29/2023](#total_duration---01---06292023)
  - [repeat\_searches - 0.1 - 06/29/2023](#repeat_searches---01---06292023)
  - [prop\_repeat\_searches - 0.1 - 06/29/2023](#prop_repeat_searches---01---06292023)
  - [search\_term\_similarity - 0.1 - 06/29/2023](#search_term_similarity---01---06292023)
  - [search\_time\_std\_dev - 0.1 - 06/29/2023](#search_time_std_dev---01---06292023)
  - [search\_open\_overlap - 0.1 - 06/29/2023](#search_open_overlap---01---06292023)
  - [search\_term\_efficiency - 0.1 - 06/29/2023](#search_term_efficiency---01---06292023)

## Count Interactions - 0.1 - 06/29/2023

This looks for event type and counts the number of occurrences.
The output is generated for each interaction log.
When an interaction is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## Ratio Interactions - 0.1 - 06/29/2023

Instead of the count of each interaction, this is a ratio of what proportion of all of their interactions are a specific type.
Can be used to see the relative frequency of different interaction types across different interaction logs.
When an interaction is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## Norm Interactions - 0.1 - 07/14/2023

A post process module that works on numeric columns.
These are duplicate columns of the other numeric columns.
The values here adjust for all the values in the table and converts the numeric values to be in the range from 0 -- 1.
This makes it easier to compare different data columns across analysis sessions.

## total_interaction_count - 0.1 - 06/29/2023

The total number of interactions recorded in an interaction log.

## total_duration - 0.1 - 06/29/2023

The time of the last recorded interaction in an interaction log.

## repeat_searches - 0.1 - 06/29/2023

Records the number of searches that are exact matches.
Not necessarily how many searches return the same results, but how many searches are an exact string match.
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## prop_repeat_searches - 0.1 - 06/29/2023

Records the ratio of searches that are exact matches.
Out of all the searches run, what proportion is the exact same string of text.
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## search_term_similarity - 0.1 - 06/29/2023

Using SpaCy's Similarity function, this records how similar words are to each other.
By looking at the terms used in search over the entire session, we can calculate a relative amount of similarity between different terms.
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## search_time_std_dev - 0.1 - 06/29/2023

A measure of burstiness in seconds.
The standard deviation in when a search is conducted in an analysis session.
When values are high, it means there is lots of variation in when searches are conducted, thus they are likely more clumped together in time.
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## search_open_overlap - 0.1 - 06/29/2023

This ratio returns the average number of documents explored from a search.
This currently only looks at the documents opened between searches.
Does not take into account the documents opened over the entire session.
A value of 1, means that, on average, a user opened every document returned from each of their searches before conducting a new search.
A value of 0, means that, on average, the user opened none of the documents returned from a search before conducting a new search.
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.

## search_term_efficiency - 0.1 - 06/29/2023

The average number of documents returned for the searches conducted by the individual.
High numbers here mean the user had inefficient search behavior because they had many documents returned per search.
Low numbers mean the session likely had too specific searches or searches that did not return any results.
This does not account for the extremes in any case.
<!-- todo: A function other than average may be better for evaluating the efficiency of the searches. -->
When a `search` event is not recorded in an interaction log, a null value will be returned to fill that space in the output spreadsheet.
