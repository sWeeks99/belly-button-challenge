// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata_field = d3.select('.metadata');

    // Filter the metadata for the object with the desired sample number
    let metadata = data.metadata.filter(item => item.id == sample)[0];
        //
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata_sample = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadata_sample.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadata).forEach(([key, value]) => {
      metadata_sample.append('p').text(`${key}: ${value}`); //appends new tag for each [key, value] pair
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples_field = d3.select('#sample-metadata');  //same as metadata_sample, renamed to samples_field for organization

    // Filter the samples for the object with the desired sample number
    let metadata = data.metadata.filter(item => item.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let samples = data.samples.filter(item => item.id == sample)[0];
    let otu_ids = samples.otu_ids;
    let otu_labels = samples.otu_labels;
    let sample_values = samples.sample_values;

    // Build a Bubble Chart
    let bubble_chart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth' //colorscale "Earth" to fit with example on module page
      }
    };
    let bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID' },
      yaxis: {title: 'Number of Bacteria'},
      height: 500,
      width: 900
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubble_chart], bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_data = {
      x: sample_values.slice(0, 10).reverse(), 
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h' // horizontal position like in module page
    };
    let bar_layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'},
      margin: {t: 30, l: 150}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [bar_data], bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names_field = d3.select('meta[name="viewport"]');

    // Use d3 to select the dropdown with id of '#selDataset'
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    data.names.forEach((name) => {
      dropdown.append('option').text(name).property('value', name);
    });

    // Get the first sample from the list
    let firstSample = data.names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();