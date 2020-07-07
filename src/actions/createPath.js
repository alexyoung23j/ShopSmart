
const store = require("../stores/vons.json")

const store_nodes = store.nodes
const store_paths = store.paths
const store_costs = store.costs

function findShortestPath(current, graph, visited) {
    paths = graph[current]

    next = null
    shortest = Math.pow(10, 1000)

    for (i = 0; i < paths.length; i++) {
        if (paths[i] < shortest && !(i in visited)) {
            shortest = paths[i]
            next = i
        }
    }

    return next
}

function greedyPath(graph) {
    visited = {}

    // Start with the entrance, always node 0
    current = 0

    count = 1
    route = new Array()
    route.push(current)

    while (count < graph[0].length) {
        visited[current] = true
        next = findShortestPath(current, graph, visited)
        route.push(next)

        count++
        current = next
    }

    return route

}

function routeDistance(route, graph) {
    dist = 0

    for (j = 0; j <route.length-1; j++) {
        dist += graph[route[j]][route[j+1]] 
    }

    return dist
}


function two_opt(route, graph) {
    optimal = route
    improving = true

    currentBest = routeDistance(optimal, graph)
    
    while (improving == true) {
        improving = false
        for (i = 1; i < route.length - 2; i++) {
            for (k = i+1; k < route.length; k++) {
                if (k-i == 1) {
                    continue
                }
                
                reverse_section = route.slice(i, k)
                reversed = reverse_section.reverse()

                route_variant = route.slice(0, i).concat(reversed, route.slice(k, route.length))
                newDist = routeDistance(route_variant, graph)

                if (newDist < currentBest) {
                    console.log("Better Solution")
                    currentBest = newDist
                    optimal = route_variant
                    improving = true
                }
            }
        }
        route = optimal
    }
    return route
}

function generatePath(nodes, paths, costs, targets) {


    const graph = new Array(targets.length)

    for (i = 0; i < targets.length;i++){
        graph[i] = new Array(0)
    }

    for (row = 0; row < targets.length; row++){
        for (col = 0; col < targets.length; col++) {
            node1 = targets[row]
            node2 = targets[col]
            graph[row][col] = costs[node1][node2]
        }
    }

    greedyRoute = greedyPath(graph)

    finalRoute = two_opt(greedyRoute, graph)

    var routePath = new Array()
    var nodeOrder = new Array()

    for (cur_node = 0; cur_node < finalRoute.length-1; cur_node++) {
        nodeOrder.push(targets[cur_node])
        routePath.push(paths[targets[cur_node]][targets[cur_node+1]])
    }

    nodeOrder.push(targets[finalRoute.length-1])

    return [routePath, nodeOrder]

}

generatePath(store_nodes, store_paths, store_costs, [0, 3, 4])





export default  function createPath(listItems) {    
    nodes = new Array()

    // Always include the entrance
    nodes.push(0)

    for (i = 0; i<listItems.length; i++) {
        nodes.push(listItems[i].categoryID)
    }

    return generatePath(store_nodes, store_paths, store_costs, nodes)
    
}