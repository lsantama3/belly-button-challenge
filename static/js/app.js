const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Promise pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

function init() {

    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
       
        let names = data.names;

        names.forEach((id) => {
            
            console.log(id);

            dropdownMenu.append("option").text(id).property("value", id);
        });

        let first = names[0];

        console.log(first);
        barChart(first);
        bubbleChart(first);
        metaData(first);
    });
    
};
    function barChart(sample) {

        d3.json(url).then((data) => {

            let allSampleData = data.samples;

            let sampleValue = allSampleData.filter(result => result.id == sample);

            let valueData = sampleValue[0];
            
            let sample_values = valueData.sample_values;
            let otu_ids = valueData.otu_ids;
            let otu_labels = valueData.otu_labels;
            
            console.log(sample_values, otu_ids, otu_labels);

            let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
            let xticks = sample_values.slice(0,10).reverse();
            let labels = otu_labels.slice(0,10).reverse();

            let trace1 = {
                x: xticks,
                y: yticks,
                text: labels,
                type: "bar",
                orientation: "h"
            };

            let layout = {title:"Top OTUs found in the Individual"};

            Plotly.newPlot("bar", [trace1], layout)
        });
    };

    function bubbleChart(sample) {

        d3.json(url).then((data) => {

            let allSampleData = data.samples;

            let sampleValue = allSampleData.filter(result => result.id == sample);

            let valueData = sampleValue[0];
            
            let sample_values = valueData.sample_values;
            let otu_ids = valueData.otu_ids;
            let otu_labels = valueData.otu_labels;
            
            console.log(sample_values, otu_ids, otu_labels);

            let trace2 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Portland"
                }
            };
            let layout = {
                title: "Sample Data Bubble Chart",
                hovermode: "closest",
                xaxis: {title: "OTU ID"},
            };

            Plotly.newPlot("bubble", [trace2], layout)
        });
    };

    function metaData(sample) {
        d3.json(url).then((data) => {
            let sampleMeta = data.metadata;
            
            let sampleValue = sampleMeta.filter(result => result.id == sample);

            console.log(sampleValue)

            let valueData = sampleValue[0];

            d3.select("#sample-metadata").html("");

            Object.entries(valueData).forEach(([key, value]) => {

                console.log(key,value);

                d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
            });
        });
    };

    function sampleChange(sampleValue) {

        console.log(sampleValue);
        barChart(sampleValue);
        bubbleChart(sampleValue);
        metaData(sampleValue);

    };

    init();