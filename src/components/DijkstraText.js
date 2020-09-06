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
          g-score, that is the smallest distance from the start node.
        </li>
        <li>
          Once that node has been selected, if the neighboring node is not in
          the closed set and not in the open set, we add that node to the open
          set and increase their g-score by one since all the edges has a weight
          of one.
          <ul>
            <li>
              If the neighbor is not in the closed set but is in the open set,
              we add one to the current neighbor's g-score. Then we compare the
              g-score of the current neighbor and the one in the open set. We
              take the lower g-score and the current neighbor's g-score is set
              to that value.
            </li>
            <li>
              If the neighboring node is not in the closed set and not in the
              open set, we update the neighbor's g-score by one and add it to
              the open set
            </li>
          </ul>
        </li>

        <li>
          The selected node is then added to the closed set and the neighbor
          node keep track of the node they came from.
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
