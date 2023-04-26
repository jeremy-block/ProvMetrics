# Investigation Analysis Metrics

This project aims to quantify the 'goodness' of someone's analysis in an investigation by calculating different analysis metrics for interaction histories of people doing investigations.

## Installation

Clone the repository to your local machine using the command `git clone https://github.com/your_username/Investigation-Analysis-Metrics.git`
Navigate to the project directory using the command `cd ProvMetrics`

Install the required dependencies by running the command

```sh

npm install

```

## Usage

Prepare a CSV file containing the interaction history of the people doing investigations.
Run the main script by executing node main.js in your terminal or command prompt.
The script will prompt you to enter the name of the CSV file containing the interaction history data.
Once the file is loaded, the script will calculate different analysis metrics and display them on the console.

## Available Metrics

The following analysis metrics are calculated by the script:

**None at this time**

Additional information about each metric can be found in the [metric description](modules/metricdescription.md) file in the `modules` folder.

## Considered Metrics

The following are metrics we hope to calculate in the near future.

**Interaction count**: The total number of interactions.

**Average response time**: The average time taken to respond to an interaction.

**Resolution rate:** The percentage of interactions that were resolved.

**First response time**: The time taken to respond to the first interaction.

**Wait time**: The time elapsed between the last interaction from the user and the first response from the investigator.

**Handling time**: The time elapsed between the first response from the investigator and the resolution of the interaction.

### Contributing

If you want to contribute to this project, you can follow these steps:

### Fork the repository

Create a new branch and make your changes.
Test your changes thoroughly.
Commit your changes and push them to your forked repository.
Submit a pull request with a detailed explanation of your changes.

### License

This project is licensed under the MIT License - see the LICENSE file for details.