import React from "react";

const DijkstraText = () => {
  return (
    <>
      <h1>Dijkstra's Algorithm</h1>

      <div className={"dijkstra-paragraph-1"}>
        Dijkstra's algorithm, developed by Dutch computer scientist Edsger W.
        Dijkstra, is a path finding algorithm that seeks to find the shortest
        path between two given nodes in a graph. Each node is connected with a
        edge of varying lengths. The goal of the algorithm is to find the
        shortest path between two given nodes. In our case, we have a graph
        represented as a grid. Each square of the grid represents a node. While
        the edges connecting the nodes is not visually present, there are edges
        of weight one connecting every single node. The user can select the
        start node by just clicking on the any of the nodes on the grid. The
        same procedure can used to set an end node. Once there is an start and
        end node, the algorithm can be begin by clicking the Start button.
      </div>

      <ol>
        <li>
          The algorithm first starts by setting the distance (from the start
          node) of every node except the start node to infinity. Since we start
          at the start node, its distance will be set to zero.
        </li>
        <li>
          The start node is then added to the open set. The open set just keeps
          track of all the nodes that have not been visited.
        </li>
        <li>
          The open set is looped through to find the node with the smallest
          distance.
        </li>
        <li>
          Once that node has been selected, if the neighboring node has not been
          visited,the distances of the neighboring nodes that are connected to
          the selected node are updated. The distance in this case refers how
          far the neighboring node is from the start node
        </li>
        <li>
          If the neighboring node has been visited,they are added to the closed
          set , which keeps track of all the nodes that have been visited.
        </li>
        <li>
          Steps 3-5 are repeated until we have selected the end node from the
          open set or until the open set is empty which means that we have
          visited every available node .
        </li>
      </ol>
    </>
  );
};

export default DijkstraText;
