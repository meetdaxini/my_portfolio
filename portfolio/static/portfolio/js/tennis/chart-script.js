import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
const GridLine = function (yScale) { return d3.axisLeft().scale(yScale) };
const renderAceGraph = () => {
  document.querySelector(".barchart-graphic").innerHTML = "";
  const margin = { top: 80, right: 20, bottom: 30, left: 40 };
  const width = 450 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const svg = d3.select(".barchart-graphic")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  d3.csv("surface_aces_matches.csv")
    .then(function (data) {
      const typeKeys = data.columns.slice(1);
      const stack = d3.stack()
        .keys(typeKeys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
      const stackedData = stack(data)
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.surface))
        .range([0, width])
        .padding(.2);
      const xAxisGroup = svg
        .append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));
      xAxisGroup.selectAll(".tick").attr("class", "x-new-tick");

      const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
      const yAxisGroup = svg
        .append('g')
        .call(d3.axisLeft(yScale).ticks(10, "%").tickSize(0).tickPadding(4))
        .call(d => d.select(".domain").remove());
      yAxisGroup.selectAll(".tick").attr("class", "y-new-tick");

      // color palette
      const color = d3.scaleOrdinal()
        .domain(typeKeys)
        .range(["#03045E", "#0077B6", "#8EBEFF"])


      svg
        .append("g")
        .attr("class", "grid")
        .call(GridLine(yScale)
          .tickSize(-width, 0, 0)
          .tickFormat("")
        );

      // create a tooltip
      const tooltip = d3.select("#barchart-parent")
        .append("div")
        .attr("class", "tooltip");

      const mousemove = function (event, d) {
        const subgroupName = d3.select(this.parentNode).datum().key;
        const subgroupValue = d.data[subgroupName];
        const f = d3.format(".0f");
        tooltip
          .html(`<b>${subgroupName}</b>:  ${f(subgroupValue * 100)}%`)
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px")
      };


      const mouseleave = function (d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      };
      const mouseover = function (d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "#EF4A60")
          .style("opacity", .5)
      };
      // create bars
      svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d.data.surface))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      // set title
      svg
        .append("text")
        .attr("class", "chart-descriptor")
        .attr("x", -(margin.left) * 0.7)
        .attr("y", -(margin.top) / 1.5)
        .attr("text-anchor", "start")
        .text("Ace Distribution of ATP Singles Matches | 2014-2023")

      //set legend
      svg
        .append("rect")
        .attr("x", -(margin.left) * 0.7)
        .attr("y", -(margin.top / 2.5))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#03045E")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left) * 0.6 + 15)
        .attr("y", -(margin.top / 3.5))
        .text("Winner sored more aces %")
      svg
        .append("rect")
        .attr("x", 122)
        .attr("y", -(margin.top / 2.5))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#0077B6")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", 142)
        .attr("y", -(margin.top / 3.5))
        .text("Equal aces %")
      svg
        .append("rect")
        .attr("x", 205)
        .attr("y", -(margin.top / 2.5))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#8EBEFF")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", 225)
        .attr("y", -(margin.top / 3.5))
        .text("Winner scored less aces %")
    })
}
const renderAgeGraph = () => {
  document.querySelector(".scatterchart-graphic").innerHTML = "";
  const margin = { top: 80, right: 20, bottom: 30, left: 40 };
  const width = 450 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3.select(".scatterchart-graphic")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${450} ${350}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("final_winner_age.csv")
    .then(function (data) {
      const f = d3.format("~s")
      const years = data.map(d => +d.tourney_year);
      const uniqueYears = [...new Set(years)];
      const xScale = d3.scaleLinear()
        .domain(d3.extent(uniqueYears))
        .range([0, width]);

      svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)
          .tickValues(uniqueYears)
          .tickFormat(d3.format("d"))
          .tickSize(0)
          .tickPadding(8))
        .call(g => g.select(".domain").remove());
      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.age)).nice()
        .range([height, 0]);
      svg
        .append('g')
        .call(d3.axisLeft(yScale).tickSize(0).ticks(6).tickPadding(4).tickFormat(f))
        .call(d => d.select(".domain").remove());
      const tournamentColors = {
        "Australian Open": "#EF4A60",
        "Roland Garros": "#8EBEFF",
        "US Open": "#00B398",
        "Wimbledon": "#E1CC0D"
      };
      const color = d3.scaleOrdinal()
        .domain(Object.keys(tournamentColors))
        .range(Object.values(tournamentColors));
      const GridLineH = function () { return d3.axisLeft().scale(yScale) };
      svg
        .append("g")
        .attr("class", "grid")
        .call(GridLineH()
          .tickSize(-width, 0, 0)
          .tickFormat("")
          .ticks(6)
        );
      const GridLineV = function () { return d3.axisBottom().scale(xScale) };
      svg
        .append("g")
        .attr("class", "grid")
        .call(GridLineV()
          .tickSize(height, 0, 0)
          .tickFormat("")
          .ticks(8)
        );
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");
      const mouseover = function (d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "#EF4A60")
          .style("opacity", .5)
      };
      const mousemove = function (event, d) {
        const f = d3.format(",");
        tooltip
          .html("<div><b>Year:</b> " + d.tourney_year + "</div><div><b>Tournament:</b> " + d.tourney_name + "</div><div><b>Winner's Age:</b> " + f(d.age) + " yrs</div>")
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px")
      };
      const mouseleave = function (d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      };
      svg.append("g")
        .selectAll("g")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(+d.tourney_year))
        .attr("cy", d => yScale(+d.age))
        .attr("r", 4)
        .style("fill", d => color(d.tourney_name))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      svg
        .append("g")
        .attr("font-size", 10)
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("dy", "0.35em")
        .attr("x", d => xScale(+d.tourney_year) + 7)
        .attr("y", d => yScale(+d.age))
      svg
        .append("text")
        .attr("class", "chart-descriptor")
        .attr("x", -(margin.left) * 0.5)
        .attr("y", -(margin.top) / 1.5)
        .attr("text-anchor", "start")
        .text("Age of Grand Slam Champions")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom * 0.9)
        .attr("text-anchor", "middle")
        .text("Year");
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left) * 0.5)
        .attr("y", -(margin.top / 8))
        .attr("text-anchor", "start")
        .text("Winner's Age (in years)")

      let legendXOffset = -15;
      const circleRadius = 4;
      const paddingBetweenCircleAndText = 5;
      const paddingAfterText = 20;

      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0, ${-margin.top / 2.5})`);

      Object.entries(tournamentColors).forEach(([tournament, color], index) => {
        const group = legend.append("g");

        group.append("circle")
          .attr("cx", legendXOffset)
          .attr("cy", circleRadius)
          .attr("r", circleRadius)
          .style("fill", color);

        const textElement = group.append("text")
          .attr("x", legendXOffset + circleRadius + paddingBetweenCircleAndText)
          .attr("y", circleRadius + 3)
          .attr("class", "legend")
          .text(tournament);
        const textWidth = textElement.node().getComputedTextLength();
        legendXOffset += circleRadius + paddingBetweenCircleAndText + textWidth + paddingAfterText;
      });
    })

}
const renderDistributionGraph = () => {
  document.querySelector(".distributionplot-graphic").innerHTML = "";
  const margin = { top: 80, right: 20, bottom: 30, left: 60 };
  const width = 450 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  const svg = d3.select(".distributionplot-graphic")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  d3.csv("distribution_data.csv")
    .then(function (data) {
      const maxValue = d3.max(data, d => Math.max(+d.winner, +d.loser));
      const xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width / 2]);
      const xScaleWinner = xScale.copy().range([width / 2, 0]);
      const xScaleLoser = xScale.copy().range([width / 2, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScaleWinner).tickSize(0).tickPadding(3).ticks(7, "%"))
        .call(function (d) { return d.select(".domain").remove() });

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScaleLoser).tickSize(0).tickPadding(3).ticks(7, "%"))
        .call(function (d) { return d.select(".domain").remove() });

      // Grid line function (can be used for both winner and loser)
      const gridLine = () => d3.axisBottom(xScale).tickSize(height, 0, 0).tickFormat("").ticks(7);

      // Add grid lines for winners
      svg.append("g")
        .attr("class", "grid")
        .call(gridLine().scale(xScaleWinner));

      // Add grid lines for losers
      svg.append("g")
        .attr("class", "grid")
        .call(gridLine().scale(xScaleLoser));

      // Y scale and Axis
      const yScale = d3.scaleBand()
        .domain(data.map(d => d.bin))
        .range([height, 0])
        .padding(.25);
      svg
        .append("g")
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(15))
        .call(d => d.select(".domain").remove());

      // create a tooltip
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

      // tooltip events
      const mouseover = function (d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "#EF4A60")
          .style("opacity", .5)
      };
      const mousemove1 = function (event, d) {
        tooltip
          .html(`<b>% of Matches of winners</b>:  ${Math.round(d.winner * 100)}%`)
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      };
      const mousemove2 = function (event, d) {
        tooltip
          .html(`<b>% of Matches of loser</b>:  ${Math.round(d.loser * 100)}%`)
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px")
      };
      const mouseleave = function (d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      };

      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom * 0.9)
        .attr("text-anchor", "middle")
        .text("% of Matches");
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left) * 0.5)
        .attr("y", -(margin.top / 8))
        .attr("text-anchor", "start")
        .text("No. of Double Faults")
      // create winner bars
      svg
        .selectAll(".winnerBar")
        .data(data)
        .join("rect")
        .attr("class", "barWinner")
        .attr("x", d => xScaleWinner(d.winner))
        .attr("y", d => yScale(d.bin))
        .attr("width", d => width / 2 - xScaleWinner(d.winner))
        .attr("height", yScale.bandwidth())
        .style("fill", "#03045E")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove1)
        .on("mouseleave", mouseleave)

      // create loser bars
      svg
        .selectAll(".loserBar")
        .data(data)
        .join("rect")
        .attr("class", "barLoser")
        .attr("x", xScaleLoser(0))
        .attr("y", d => yScale(d.bin))
        .attr("width", d => xScaleLoser(d.loser) - xScaleLoser(0))
        .attr("height", yScale.bandwidth())
        .style("fill", "#0077B6")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave)

      // set title
      svg
        .append("text")
        .attr("class", "chart-descriptor")
        .attr("x", -(margin.left) * 0.7)
        .attr("y", -(margin.top) / 1.5)
        .attr("text-anchor", "start")
        .text("Distribution of double faults | 2014 -2023")

      //set legend
      svg
        .append("rect")
        .attr("x", -(margin.left) * 0.7)
        .attr("y", -(margin.top / 2))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#03045E")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left) * 0.6 + 15)
        .attr("y", -(margin.top / 2.8))
        .text("Winner")
      svg
        .append("rect")
        .attr("x", 40)
        .attr("y", -(margin.top / 2))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#0077B6")
      svg
        .append("text")
        .attr("class", "legend")
        .attr("x", 60)
        .attr("y", -(margin.top / 2.8))
        .text("Loser")

    })
}
const render = () => {
  renderAceGraph();
  renderAgeGraph();
  renderDistributionGraph();
};
render();
window.addEventListener("resize", render);
