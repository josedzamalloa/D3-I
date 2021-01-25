// I. Configuracion

graf = d3.select('#graf')
ancho_total = graf.style('width').slice(0,-2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)


margins = { top: 30, left: 50, right: 15, bottom: 140 }

ancho = ancho_total - margins.left - margins.right
alto = alto_total - margins.top -  margins.bottom


// II. Variables globales
svg = graf.append('svg')
        .style('width', `${ ancho_total }px`)
        .style('height', `${ alto_total }px`)

g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)        
        .attr('width', ancho + 'px')
        .attr('height', alto  + 'px')

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
        .range(d3.schemePaired)

xAxisGroup = g.append('g')
        .attr('transform', `translate(0, ${ alto })`)
        .attr('class', 'eje')
yAxisGroup = g.append('g')
        .attr('class', 'eje')

titulo = g.append('text')
        .attr('x', `${ancho / 2}px`)
        .attr('y', '-5px')
        .attr('text-anchor', 'middle')
        .text('Los Edificios Más Grandes del Mundo')
        .attr('class', 'titulo-grafica')




dataArray = []


// III. Render

function render(data) {
    bars = g.selectAll('rect')
    .data(data)

    bars.enter()
        .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        
        .style('y', `${y(0)}px`)
        .style('fill', '#eee')
        .style('x', d => x(d.edificio) + 'px')
        .transition()
        .duration(2000)
        
        .style('y', d => (y(d.oficial)) + 'px')
        .style('width', d => `${x.bandwidth()}px`)
        .style('height', d => (alto - y(d.oficial)) + 'px')
        .style('fill', d => color(d.region))


        yAxisCall = d3.axisLeft(y)
                    .ticks(3)
                    .tickFormat(d => `${d} m.`)
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
// d3.csv('datos/country_vaccinations.csv').then(function(data){
//     console.log(data)
// })


d3.csv('datos/edificios.csv').then(function(data){
    console.log(data)
    data.forEach(d => {
        d.oficial = +d.oficial
        d.ano = +d.ano
        d.antena = +d.antena
        d.piso = +d.piso
        d.puesto = +d.puesto
        d.ultimopiso = +d.ultimopiso       
    })

    data = data.slice(0, 15)

    this.dataArray = data
    //Calcular la altura más alta dentro de los datos
    maxy = d3.max(data, d => d.oficial)
    y.domain([0, maxy])

    x.domain(data.map( d => d.edificio))
//    console.log('Edificios')
//    console.log(data.map( d=>d.edificio))
    
    color.domain(data.map( d => d.region))

    render(dataArray)

}).catch(e => {
    console.log('No se tuvo acceso al archivo ' + e.message)
})


// V. Despliegue
