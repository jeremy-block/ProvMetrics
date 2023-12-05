# Install and load required packages
if (!requireNamespace("ggplot2", quietly = TRUE)) {
  install.packages("ggplot2")
}
library(ggplot2)

# Set the working directory to where your CSV files are located
setwd("./output/metricSegments/")

# List all CSV files in the directory
# csv_files <- list.files(pattern = "\\.csv$")

# Specify the color palette for user categories
category_colors <- c("Arms Dealing" = "blue", "Terrorist Activites" = "green", "Company Kidnapping" = "red", "Panda Jam" = "orange", "Insider Attack" = "purple")

# Loop through each CSV file
# for (csv_file in csv_files) {
  
  # Read the CSV file
  # data <- read.csv(csv_file)
csv_file <- "fixed_seg.csv"
  data <- read_csv(csv_file, 
                              col_types = cols(time = col_factor(levels = c("0", 
                              "1", "2", "3", "4", "5", "6", "7", 
                              "8", "9")), section = col_factor(levels = c("Arms Dealing", 
                              "Terrorist Activites", "Company Kidnapping", 
                              "Panda Jam", "Insider Attack"))))

  
  # Get a vector of unique metric names
  metric_names <- colnames(data)[!colnames(data) %in% c("time", "session", "section")]
  
  # Loop through each metric and create a line chart
  for (metric in metric_names) {
    # Create a plot for each metric
    p <- ggplot(data, aes(x = time, y = !!sym(metric), color = factor(section), group = session)) +
      geom_line(alpha=0.2) +
      geom_smooth(aes(group = section), method = "lm", se = FALSE, linetype = "dashed")
      labs(title = paste("Line Chart for", metric),
           x = "Time",
           y = metric,
           caption = "Your caption here") +
      theme_minimal()
    
    # Save the plot to a file (change the file format as needed, e.g., png, pdf, etc.)
    ggsave(paste0("images/", metric, ".png"), plot = p, device = "png", width = 10, height = 6)
  }
  
  # Display the plots (optional)
  # print(p)
  


# Print a message indicating the completion of the script
cat("Line charts generated and saved successfully.\n")

