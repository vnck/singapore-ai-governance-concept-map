let graph_data = null;
let nodes = null;
let links = null;
let linkIndex = {};
let svg = null;
let g = null; // for zoom handler
let simulation = null;
let graph_nodes = null;
let graph_links = null;
let graph_paths = null;
let minWeight, maxWeight = null;
let minNodeMeasure, maxNodeMeasure = null;
let width = 600;
let height = 600;
let node_measure = 'frequency';
let nodeClicked = false;
let egoCheck = false;
let edgeWeightColorSelection = 'tag';
let forceMultiplier = -20;
let tag_filter = {
    'TECH': true,
    'ORG': true,
    'INST': true,
    'GOVT': true,
    'POLICY': true,
    'ETHICS': true,
    'VALUES': true,
    'LOC': true,
    'PERSONS': true,
    'TEMPORAL': true,
    'OBJECTS': true,
}
let tag_dict = {
    'TECH': ['TECH'],
    'ORG': ['ORG'],
    'INST': ['DOMAIN','EDU'],
    'GOVT': ['GOVT'],
    'POLICY': ['LAW','POLICY'],
    'ETHICS': ['ETHIC_BENEFICIANCE','ETHIC_FAIRNESS','ETHIC_CONCERNS','ETHIC_SAFETY','ETHIC_SUSTAINABILITY','ETHIC_RESPONSIBILITY','ETHIC_TRUST','ETHIC_PRIVACY','ETHIC_TRANSPARENCY','ETHIC_AUTONOMY'],
    'VALUES': ['VALUE_FUTURE','VALUE_ENCOMPASSING','VALUE_ACCOMPLISHMENT','VALUE_COOPERATION','VALUE_DIVERSITY','VALUE_AGGRESSIVENESS'],
    'LOC': ['FAC','GPE','LOC'],
    'PERSONS': ['PEOPLE','PERSON','LANGUAGE','NORP'],
    'TEMPORAL': ['DATE','EVENT','TIME'],
    'OBJECTS': ['PRODUCT','OBJECT','WORK_OF_ART'],
}
let tag_list = [];
Object.keys(tag_filter).map(key => tag_filter[key] ? tag_list = tag_list.concat(tag_dict[key]): null);

let edgeWeightColor = (d) => {
    if (edgeWeightColorSelection === 'tag') {
        return d3.interpolateRgb(d.source.color, d.target.color)(0.5);
    } else {
        return linkColorScale(d.weight);
    }
}

$(document).ready(() => {
    load_graph();
});

let load_graph = () => {
    d3.json('data/graph_window2_90p_kcore2_0713.json').then((data) => {
        graph_data = data;
        nodes = data.nodes;
        links = data.links;
        links.forEach(d => {linkIndex[d.source + ',' +d.target] = 1});
        let weightRange = d3.extent(links.reduce((a,b) => a.concat(b.weight), []));
        minWeight = weightRange[0];
        maxWeight = weightRange[1] + 1;
        let nodeMeasureRange = d3.extent(nodes.reduce((a,b) => a.concat(b[node_measure]), []));
        minNodeMeasure = nodeMeasureRange[0];
        maxNodeMeasure = nodeMeasureRange[1];
        create_graph();
        update();
    })
}

let linkColorScale = null;
let linkWidthScale = null;
let linkOpacityScale = null;
let nodeSizeScale = null;
let nodeFontScale = null;

let create_graph = () => {

    svg = d3.select("#graph")
        .attr("viewBox", [0,0,width,height]);

    svg.call(zoom);

    linkColorScale = d3.scaleLinear()
        .domain([minWeight,maxWeight])
        .range(['LightSkyBlue','DarkBlue']);

    linkWidthScale = d3.scaleLinear()
        .domain([minWeight,maxWeight])
        .range([1,10]);

    linkOpacityScale = d3.scaleLinear()
        .domain([minWeight,maxWeight])
        .range([0.3,1]);
    
    nodeMeasureScale = d3.scaleLinear()
        .domain([minNodeMeasure,maxNodeMeasure])
        .range([3,50]);

    nodeFontScale = d3.scaleLinear()
        .domain([minNodeMeasure,maxNodeMeasure])
        .range([9,12]);

    g = svg.append('g')
        .attr('class','everything');

    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id));
    
    graph_links = g.append('g')
        .selectAll('path')
        .data(links, d => d.id);

    
    graph_nodes = g.append('g')
        .selectAll('g')
        .data(nodes, d => d.id);
    
}

let linkArc = d => {
    let r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
}

let ticked = () => {
    graph_links.attr("d", linkArc);
    graph_nodes.attr("transform", d => `translate(${d.x},${d.y})`);
}

let drag = (simulation) => {
    let dragStarted = event => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    let dragged = event => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    let dragEnded = event => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}

let zoom_actions = event => {
    g.attr("transform", event.transform)
};

let zoom = d3.zoom()
    .on('zoom',zoom_actions)
    .scaleExtent([0.1,10]);

let update = () => {

    graph_nodes = graph_nodes.data(nodes, d => d.id);

    let new_graph_nodes = graph_nodes.enter()
        .append('g')

    new_graph_nodes.append('circle')
        .attr('r', d => nodeMeasureScale(d[node_measure]))
        .attr('fill', d => d.color)
        .attr('stroke','#111111')
        .attr('stroke-width', 1.5);

    new_graph_nodes.append('text')
        .attr('font-size', d => nodeFontScale(d[node_measure]))
        .attr('color', '#111111')
        .attr("class", "text-outline")	
        .attr("text-anchor",'middle')
        .text(d => d.id);
    
    new_graph_nodes.append('title')
        .text(d => `id: ${d.id}, ${node_measure}: ${d[node_measure]}`)

    new_graph_nodes.append('title')
        .text(d => `id: ${d.id}, ${node_measure}: ${d[node_measure]}`);

    new_graph_nodes
        .on('click', (event,d) => {
            if (!nodeClicked) {
                graph_nodes
                    .transition().duration(200)
                    .attr('opacity', (o) => o.id === d.id | linkIndex[o.id+','+d.id] == 1 | linkIndex[d.id+','+o.id] == 1 ? 1 : 0.1);
                graph_links
                    .transition().duration(200)
                    .attr('opacity', (o) => o.source.id === d.id | o.target.id === d.id ? 1 : 0.1);
                nodeClicked = true;
            } else {
                graph_nodes
                    .transition().duration(200)
                    .attr('opacity', 1);
                graph_links
                    .transition().duration(200)
                    .attr('opacity', d => linkOpacityScale(d.weight));
                nodeClicked = false;
            }
        });

    new_graph_nodes.call(drag(simulation));

    graph_nodes.exit().remove();

    graph_nodes = graph_nodes.merge(new_graph_nodes);

    graph_links = graph_links.data(links, d => d.id);

    let new_graph_links = graph_links.enter()
        .append('path')
        .attr('fill','none')
        .attr('stroke', d => edgeWeightColor(d))
        .attr('stroke-width', d => linkWidthScale(d.weight))
        .attr('opacity', d => linkOpacityScale(d.weight));
    
    new_graph_links.append('title')
        .text(d => `${d.source.id}—${d.target.id}, weight: ${d.weight}`);

    graph_links.exit().remove();

    graph_links = graph_links.merge(new_graph_links);

    simulation
        .nodes(nodes)
        .on('tick', ticked);
        
    simulation
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(d => nodeMeasureScale(d[node_measure]) * forceMultiplier))
        .force('collide',d3.forceCollide(d => nodeMeasureScale(d[node_measure]) + 2))
        .force("center", d3.forceCenter(width/2,height/2));

    simulation.alpha(1).alphaTarget(0).restart();
}

let filterEgoGraph = (checked) => {
    egoCheck = checked;
    filter();
    update();
}

let filterTags = (value, checked) => {
    tag_filter[value] = checked;
    tag_list = []
    Object.keys(tag_filter).map(key => tag_filter[key] ? tag_list = tag_list.concat(tag_dict[key]): null);
    filter();
    update();
}

let filter = () => {
    nodes = graph_data.nodes.filter(d => d.ego_ai > (egoCheck ? 0 : -1));
    nodes = nodes.filter(d => tag_list.includes(d.tag));
    node_list = nodes.map(node => node.id);
    links = graph_data.links.filter(d => node_list.includes(d.source.id) & node_list.includes(d.target.id));
}

let updateNodeMeasure = (value) => {
    node_measure = value;
    let nodeMeasureRange = d3.extent(nodes.reduce((a,b) => a.concat(b[node_measure]), []));
    minNodeMeasure = nodeMeasureRange[0];
    maxNodeMeasure = nodeMeasureRange[1];
    
    nodeMeasureScale = d3.scaleLinear()
        .domain([minNodeMeasure,maxNodeMeasure])
        .range([3,50]);

    graph_nodes.select('circle')
        .attr('r', d => nodeMeasureScale(d[node_measure]));
    
    graph_nodes.select('title')
        .text(d => 'id: ' + d.id + ', ' + node_measure + ': ' + d[node_measure]);
}

let updateEdgeColor = (value) => {
    edgeWeightColorSelection = value;

    svg.selectAll('path')
        .attr('stroke', d => edgeWeightColor(d));
}

let updateForceMultiplier = (value) => {
    forceMultiplier = value * -1;
    update();
}