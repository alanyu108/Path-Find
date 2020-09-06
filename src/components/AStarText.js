import React from "react";

const AStarText = () => {
  return (
    <>
      <div>
        <h1>A* Algorithm</h1>

        <div className={"astar-paragraph-1"}>
          The A* algorithm is another path finding algorithm developed by a
          research team at the Stanford Research Institute during the late
          1960s. Similar to Dijsktra's algoritm, the algorithm aims to find the
          shortest path between two given nodes. However, Dijkstra's algorithm
          is particular ineffcient because it does not consider the position of
          the end node. For example, if we had a start node with the end node
          being directly to the right of the start node, the algorithm would
          still spend as much time checking the left and the right side despite
          the end node being on the right. A*, on the other hand, has a
          hueristic, that is a way of making the probelm simpler.
        </div>

        <div>
          This hueristic, h-score, is the euclidean distance between a node and
          the end node. With this, the algorithm is steered towards the end node
          instead of mindlessly seraching in all direction like Dijksra's
          algorithm. This hueristic is added with the g-score, used in
          Dijkstra's algorithm, to create the f-score. The A* algorithm will
          then look for the lowest f-score the determine the next node to move
          to and the algorithm will finish when there are no more nodes to
          explore or the end node has been found.
        </div>
      </div>
    </>
  );
};

export default AStarText;
