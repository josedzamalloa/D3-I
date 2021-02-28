//import * as d3Collection from 'd3-collection'

// I. Configuracion

graf = d3.select('#graf')
ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ancho_total}px`)
        .style('height', `${alto_total}px`)

margins = { top: 20, left: 80, right: 20, bottom: 30 }

ancho = ancho_total - margins.left - margins.right
alto = alto_total - margins.top - margins.bottom

//var tooltip = d3.select("#graf").append("div").attr("class", "toolTip")

// II. Variables globales
svg = graf.append('svg')
        //.style('width', `${ancho_total}px`)
        //.style('height', `${alto_total}px`)
        .attr("width", ancho + margins.left + margins.right)
        .attr("height", alto + margins.top + margins.bottom)

color = d3.scaleOrdinal()
        .range(['#5f0f40', '#9a031e', '#fb8b24', '#0f4c5c', '#323031'])
continente = 'todas'
continenteSelect = d3.select('#continente')

//Parser para fechas        
parseTime = d3.timeParse("%d/%m/%Y")

g = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

//Escaladores        
x = d3.scaleTime().range([0, ancho])
y = d3.scaleLinear().range([alto, 0])



// define the 1st line
var valueline = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.total_vaccinations); })

// define the 2nd line
// var valueline2 = d3.line()
//         .x(function (d) { return x(d.date); })
//         .y(function (d) { return y(d.open); })

// Get the data
d3.csv("datos/country_vaccinations3.csv").then(function (data) {

        // format the data
        data.forEach(d => {
                d.daily_vaccinations = +d.daily_vaccinations
                d.daily_vaccinations_per_million = +d.daily_vaccinations_per_million
                d.daily_vaccinations_raw = +d.daily_vaccinations_raw
                d.date = parseTime(d.date)
                d.people_fully_vaccinated = +d.people_fully_vaccinated
                d.people_fully_vaccinated_per_hundred = +d.people_fully_vaccinated_per_hundred
                d.people_vaccinated = +d.people_vaccinated
                d.people_vaccinated_per_hundred = +d.people_vaccinated_per_hundred
                d.total_vaccinations = +d.total_vaccinations
                d.total_vaccinations_per_hundred = +d.total_vaccinations_per_hundred
        })
        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date }))
        y.domain([0, d3.max(data, function (d) {
                return Math.max(d.total_vaccinations)
        })])

        // Add the valueline path.
        g.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline)

        // Add the valueline2 path.
        // g.append("path")
        //         .data([data])
        //         .attr("class", "line")
        //         .style("stroke", "red")
        //         .attr("d", valueline2)

        // Add the X Axis
        g.append("g")
                .attr('transform', `translate(0, ${alto})`)
                .call(d3.axisBottom(x))

        // Add the Y Axis
        g.append("g")
                .call(d3.axisLeft(y))

        color.domain(data.map(d => d.continent))

        continenteSelect.append('option')
                .attr('value', 'todas')
                .text('Todas')
        color.domain().forEach(d => {
                continenteSelect.append('option')
                        .attr('value', d)
                        .text(d)
        })

});

continenteSelect.on('change', () => {
        continente = continenteSelect.node().value
        //frame()
})