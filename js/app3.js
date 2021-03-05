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

dataArray = []
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

xAxisGroup = g.append('g')
        .attr('transform', `translate(0, ${alto})`)
        .attr('class', 'eje')

yAxisGroup = g.append('g')
        .attr('class', 'eje')


// Funcion para dibujar linea
var valueline = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.total_vaccinations); })

function render(datos) {
        lines = g.selectAll("lines")
                .data([datos])

        x.domain(d3.extent(datos, function (d) { return d.date }))
        y.domain([0, d3.max(datos, function (d) {
                //return Math.max(d.total_vaccinations)
                return d.total_vaccinations
        })])

        xAxisCall = d3.axisBottom(x)
        xAxisGroup.call(xAxisCall)

        yAxisCall = d3.axisLeft(y)
        
        yAxisGroup.call(yAxisCall)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("dy", ".75em")
                .attr("y", 6)
                .style("text-anchor", "end")
                .text("Vacunas");

        dataNest = Array.from(
                d3.group(datos, d => d.country), ([key, value]) => ({ key, value })
        );
        console.log(dataNest)


        // lines.enter()
        //         .append("path")
        //         .attr("class", "line")
        //         .style("stroke", function () { // Add the colours dynamically
        //                 return d.color = color(d.continent);
        //         })
        //         .attr("d", valueline);

        // lines.exit()
        //         .style('stroke', '#fff')
        //         .style("-webkit-tap-highlight-color", "transparent")
        //         .remove()

        dataNest.forEach(function (d, i) {


                lines.enter()
                        .append("path")
                        .attr("class", "line")
                        .style("stroke", function () { // Add the colours dynamically
                                return d.color = color(d.key);
                        })
                        .attr("id", 'tag' + d.key.replace(/\s+/g, '')) // assign an ID
                        .attr("d", valueline(d.value))
                        .style("mix-blend-mode", "multiply")



                //console.log(d.value)




                //.merge(lines)
                // lines.exit()
                //         .attr("display", null)
                //         .remove()
                // Add the Legend
                // svg.append("text")
                //         .attr("x", (legendSpace / 2) + i * legendSpace)  // space legend
                //         .attr("y", alto + (margins.bottom / 2) + 5)
                //         .attr("class", "legend")    // style the legend
                //         .style("fill", function () { // Add the colours dynamically
                //                 return d.color = color(d.key);
                //         })
                //         .on("click", function () {
                //                 // Determine if current line is visible 
                //                 var active = d.active ? false : true,
                //                         newOpacity = active ? 0 : 1;
                //                 // Hide or show the elements based on the ID
                //                 d3.select("#tag" + d.key.replace(/\s+/g, ''))
                //                         .transition().duration(100)
                //                         .style("opacity", newOpacity);
                //                 // Update whether or not the elements are active
                //                 d.active = active;
                //         })
                //         .text(d.key);

        });


}


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
        //console.log(data)

        //x.domain(d3.extent(data, function (d) { return d.date }))
        // y.domain([0, d3.max(data, function (d) {
        //         //return Math.max(d.total_vaccinations)
        //         return d.total_vaccinations
        // })])



        // g.append("g")
        //         .attr("class", "axis")
        //         .attr('transform', `translate(0, ${alto})`)
        //         .call(d3.axisBottom(x))

        // // Add the Y Axis
        // g.append("g")
        //         .attr("class", "axis")
        //         .call(d3.axisLeft(y))
        //         .append("text")
        //         .attr("transform", "rotate(-90)")
        //         .attr("dy", ".75em")
        //         .attr("y", 6)
        //         .style("text-anchor", "end")
        //         .text("Vacunas");



        // lines.append("text")
        //         .attr("class", "serie_label")
        //         .datum(function (d) {
        //                 return{
        //                         id: d.country,
        //                         value: d.country
        //                 }
        //         })
        //         .attr("transform", function (d) {
        //                 return "translate(" + (x(d.date) + 10)
        //                         + "," + (y(d.total_vaccinations) + 5) + ")";
        //         })
        //         .attr("x", d=>d.total_vaccinations)
        //         .text("Hola")


        // g.append("path")
        //         .data([data])
        //         .attr("class", "line")
        //         .attr("d", valueline)

        dataArray = data

        color.domain(data.map(d => d.continent))

        continenteSelect.append('option')
                .attr('value', 'todas')
                .text('Todas')

        color.domain().forEach(d => {
                continenteSelect.append('option')
                        .attr('value', d)
                        .text(d)
        })

        frame()

});

function frame() {
        dataframe = dataArray
        if (continente != 'todas') {
                dataframe = d3.filter(dataframe, d => d.continent == continente)
        }
        render(dataframe)
}

continenteSelect.on('change', () => {
        continente = continenteSelect.node().value
        g.selectAll("path")
                .remove()
                .transition()
                .duration(3000)
        frame()
})

// function mousemove(e) {
//         //console.log(`${d3.pointer(e)}`)

//         // Este artículo explica bien que es un bisector y la
//         // filosofía tras el:
//         // https://stackoverflow.com/questions/26882631/d3-what-is-a-bisector

//         x0 = x.invert(d3.pointer(e)[0])

//         bisectDate = d3.bisector((d) => d.Date).left
//         i = bisectDate(dataArray, x0, 1)
//         //console.log(`${x0} = ${i}`)

//         d0 = dataArray[i - 1],
//                 d1 = dataArray[i],
//                 d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

//         focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.total_vaccinations) + ")");
//         focus.select("text").text(function () { return d.total_vaccinations; });
//         console.log(d.total_vaccinations)
//         focus.select(".x-hover-line").attr("x2", -x(d.Date))
//         focus.select(".y-hover-line").attr("y2", alto - y(d.total_vaccinations))
// }

function hover(svg, path) {

        if ("ontouchstart" in document) svg
                .style("-webkit-tap-highlight-color", "transparent")
                .on("touchmove", moved)
                .on("touchstart", entered)
                .on("touchend", left)
        else svg
                .on("mousemove", moved)
                .on("mouseenter", entered)
                .on("mouseleave", left);

        const dot = svg.append("g")
                .attr("display", "none");

        dot.append("circle")
                .attr("r", 2.5);

        dot.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("y", -8);

        function moved(event) {
                event.preventDefault();
                const pointer = d3.pointer(event, this);
                const xm = x.invert(pointer[0]);
                const ym = y.invert(pointer[1]);
                const i = d3.bisectCenter(data.dates, xm);
                const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
                path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
                dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
                dot.select("text").text(s.name);
        }

        function entered() {
                path.style("mix-blend-mode", null).attr("stroke", "#ddd");
                dot.attr("display", null);
        }

        function left() {
                path.style("mix-blend-mode", "multiply").attr("stroke", null);
                dot.attr("display", "none");
        }
}