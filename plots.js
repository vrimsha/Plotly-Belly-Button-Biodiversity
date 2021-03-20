function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    })
}
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildBubbleCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(key.toUpperCase() + ':' + " " + value);
        })
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var resultArray = data.samples.filter(sampleObj => {
            return sampleObj.id == sample
        });

        var result = resultArray[0];

        var topTenOtuIds = result.otu_ids.slice(0, 10).map(ids => {
            return 'OTU' + " " + ids;
        }).reverse();

        var topTenBacterialSpecies = result.sample_values.slice(0, 10).reverse();
        var topTenBacterialSpeciesLabels = result.otu_labels.slice(0, 10).reverse();

        var trace = {
            x: topTenBacterialSpecies,
            y: topTenOtuIds,
            text: topTenBacterialSpeciesLabels,
            type: "bar",
            orientation: 'h'
        };
        var data = [trace];
        var layout = {
            title: "Top Ten Bacterial Species"
        };
        Plotly.newPlot("bar", data, layout)
    })
}

function buildBubbleCharts(sample) {
    d3.json("samples.json").then((data) => {
        var resultArray = data.samples.filter(sampleObj => {
            return sampleObj.id == sample
        });

        var result = resultArray[0];

        var OtuIds = result.otu_ids.map(ids => {
            return ids;
        }).reverse();

        var BacterialSpecies = result.sample_values.reverse();
        var BacterialSpeciesLabels = result.otu_labels.reverse();

        var trace = {
            x: OtuIds,
            y: BacterialSpecies,
            text: BacterialSpeciesLabels,
            mode: 'markers',
            marker: {
                color: OtuIds,
                size: BacterialSpecies
            }
        };
        var data = [trace];
        var layout = {
            title: "OTU ID",
            showlegend: false,
            height: 600,
        };
        Plotly.newPlot("bubble", data, layout)
    })
}

optionChanged(940);