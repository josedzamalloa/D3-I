//import * as d3Collection from 'd3-collection'

// I. Configuracion

graf = d3.select('#graf')
ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ancho_total}px`)
        .style('height', `${alto_total}px`)



margins = { top: 30, left: 50, right: 15, bottom: 140 }

ancho = ancho_total - margins.left - margins.right
alto = alto_total - margins.top - margins.bottom

var tooltip = d3.select("#graf").append("div").attr("class", "toolTip")

// II. Variables globales
svg = graf.append('svg')
        .style('width', `${ancho_total}px`)
        .style('height', `${alto_total}px`)



g = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')


fontsize = alto * 0.25
dateDisplay = g.append('text')
        .attr('x', ancho / 2)
        .attr('y', alto / 2 - fontsize)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Roboto')
        .attr('font-size', `${fontsize}px`)
        .attr('fill', '#cccccc')
        .text('13/12/2020')


y = d3.scaleLinear()
        .range([alto, 0])

// Utilizacion de escalador de banda: scaleBand()
x = d3.scaleBand()
        .range([0, ancho])
        .paddingInner(0.1)
        .paddingOuter(0.3)

//Convertir datos ordinales, scaleOrdinal()

color = d3.scaleOrdinal()
        //    .range(['red', 'green', 'blue', 'yellow'])
        //.range(d3.schemePaired)
        .range(['#5f0f40', '#9a031e', '#fb8b24', '#0f4c5c', '#323031'])

xAxisGroup = g.append('g')
        .attr('transform', `translate(0, ${alto})`)
        .attr('class', 'eje')

yAxisGroup = g.append('g')
        .attr('class', 'eje')

titulo = g.append('text')
        .attr('x', `${ancho / 2}px`)
        .attr('y', '-5px')
        .attr('text-anchor', 'middle')
        .text('TOTAL DE VACUNACIONES DIARIAS POR PAÍS')
        .attr('class', 'titulo-grafica')





dataArray = []
fechas = []
ifecha = 0
corriendo = true
var interval



continente = 'todas'
continenteSelect = d3.select('#continente')
botonPausa = d3.select('#pausa')
slider = d3.select('#slider');

// III. Render

function render(data) {

        //dateDisplay.text(Date(ifecha))
        dateDisplay.text(moment(fechas[ifecha]).format('DD/MM/YYYY'))
        bars = g.selectAll('rect')
                .data(data, d => d.country)

        bars.enter()
                .append('rect')
                .style('width', '0px')
                .style('height', '0px')

                .style('y', `${y(0)}px`)
                .style('fill', '#eee')
                /*.on('mousemove', () => {
                        tooltip
                                .style("left", 70 + 'px')
                                .style("top", 50 + 'px')
                                .style("display", "inline-block")
                                .html(d=>d.country)

                })
                .on("mouseout", function (d) { tooltip.style("display", "none") })*/

                //.style('x', d => x(d.key) + 'px')
                .merge(bars)
                .transition()
                .duration(2000)
                .style('x', d => x(d.country) + 'px')
                .style('y', d => (y(d.total_vaccinations)) + 'px')
                //.style('y', d => (y(d.value)) + 'px')
                .style('width', d => `${x.bandwidth()}px`)
                .style('height', d => (alto - y(d.total_vaccinations)) + 'px')
                //.style('height', d => (alto - y(d.value)) + 'px')
                .style('fill', d => color(d.continent))


        bars.exit()
                .transition()
                .duration(2000)
                .style('height', '0px')
                .style('y', d => `${y(0)}px`)
                .style('fill', '#eee')
                .remove()

        yAxisCall = d3.axisLeft(y)
                .ticks(3)
                .tickFormat(d => `${d / 1000000} mill.`)
        yAxisGroup.call(yAxisCall)

        xAxisCall = d3.axisBottom(x)
        xAxisGroup.call(xAxisCall)
                .selectAll('text')
                .attr('x', '-8px')
                .attr('y', '-5px')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')




}

// IV. Carga de Datos

d3.csv('datos/country_vaccinations2.csv').then(function (data) {
        //onsole.log(data)
        data.forEach(d => {
                d.daily_vaccinations = +d.daily_vaccinations
                d.daily_vaccinations_per_million = +d.daily_vaccinations_per_million
                d.daily_vaccinations_raw = +d.daily_vaccinations_raw
                fecha = d.date.split('/')
                //d.date = moment(d.date)
                d.date = new Date(fecha[2], fecha[1] - 1, fecha[0])
                d.date = Date.parse(d.date)
                //console.log(Date.parse(d.date))
                //mifecha = Date.parse(d.date)
                //console.log(Date(mifecha))
                d.people_fully_vaccinated = +d.people_fully_vaccinated
                d.people_fully_vaccinated_per_hundred = +d.people_fully_vaccinated_per_hundred
                d.people_vaccinated = +d.people_vaccinated
                d.people_vaccinated_per_hundred = +d.people_vaccinated_per_hundred
                d.total_vaccinations = +d.total_vaccinations
                d.total_vaccinations_per_hundred = +d.total_vaccinations_per_hundred
        })

        fechas = Array.from(new Set(data.map(d => d.date))).sort()
        //console.log(fechas)
        /*nested_data = d3.nest()
                    .key(function(d){ return d.country })
                    .key(function(d){ return d.continent })
                    .rollup(function(f){ return d3.sum(f, function(v){ return v.total_vaccinations }) })
                    .entries(data)
                    .sort(function(a,b){ return d3.descending( a.value, b.value)})
                    //.map( function (group){ return  [`country: ${group.key}`, `total_vaccinations :${+group.value}`] })
        console.log(nested_data)
        */
        //data = data.slice(0, 15)
        //nested_data = nested_data.slice(0, 15)

        dataArray = data

        slider.attr('min', 0)
                .attr('max', fechas.length - 1)
        slider.node().value = 0


        //x.domain(nested_data.map( d => d.key))
        //x.domain(data.map( d => d.key))
        //    console.log('countrys')
        //    console.log(data.map( d=>d.country))

        color.domain(data.map(d => d.continent))

        continenteSelect.append('option')
                .attr('value', 'todas')
                .text('Todas')
        color.domain().forEach(d => {
                console.log(d)
                continenteSelect.append('option')
                        .attr('value', d)
                        .text(d)
        })

        // V. Despliegue

        frame()
        interval = d3.interval(() => delta(1), 2500)

}).catch(e => {
        console.log('No se tuvo acceso al archivo ' + e.message)
})


function frame() {
        dataframe = dataArray
        fecha = fechas[ifecha]
        dataframe = d3.filter(dataArray, d => d.date == fecha)
        //ifecha = fechas[15]
        /*dataframe = d3.filter(dataArray, d => {
                if (continente == 'todas')
                        return true
                else
                        return d.continent == continente
        })*/

        if (continente != 'todas') {
                dataframe = d3.filter(dataframe, d => d.continent == continente)
        }

        dataframe.sort((a, b) => {
                return d3.descending(a.total_vaccinations, b.total_vaccinations)

        })

        //Calcular la altura más alta dentro de los datos
        maxy = d3.max(dataframe, d => d.total_vaccinations)
        if (maxy == 0) maxy = 100000
        //maxy = d3.max(data, d => d.value)
        y.domain([0, maxy])

        x.domain(dataframe.map(d => d.country))

        slider.node().value = ifecha

        render(dataframe)

}

function delta(d) {
        ifecha += d
        //console.log(fechas.length)
        if (ifecha < 0) ifecha = fechas.length - 1
        if (ifecha > fechas.length - 1) ifecha = 0
        frame()
}

continenteSelect.on('change', () => {
        continente = continenteSelect.node().value
        frame()
})


botonPausa.on('click', () => {
        corriendo = !corriendo
        if (corriendo) {
                botonPausa
                        .classed('btn-danger', true)
                        .classed('btn-success', false)
                        .html('<i class="fas fa-pause-circle"></i>')
                interval = d3.interval(() => delta(1), 2500)
        } else {
                botonPausa
                        .classed('btn-danger', false)
                        .classed('btn-success', true)
                        .html('<i class="fas fa-play-circle"></i>')
                interval.stop()
        }
})

slider.on('input', () => {
        // d3.select('#sliderv').text(slider.node().value)
        ifecha = +slider.node().value
        frame()
})

slider.on('mousedown', () => {
        if (corriendo) interval.stop()
})

slider.on('mouseup', () => {
        if (corriendo) interval = d3.interval(() => delta(1), 2500)
})