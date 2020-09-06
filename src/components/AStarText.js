import React from "react";
import { MathComponent } from "mathjax-react";

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
          hueristic, that is a way of making the probelm simpler. This
          hueristic, h-score, is the euclidean distance between a node and the
          end node,
          <MathComponent
            tex={String.raw`h(n)= \sqrt{(x_{1}-x_{2})^{2}+(y_{1}-y_{2})^{2}}`}
          />
          where x and y refers to the node's position on the grid. With this,
          the algorithm is steered towards the end node instead of mindlessly
          seraching in all direction like Dijksra's algorithm. This hueristic is
          added with the g-score, used in Dijkstra's algorithm, to create the
          f-score.
          <MathComponent tex={String.raw`f(n)= g(n)+h(n)`} />
          The A* algorithm runs similarly to Dijkstra's algorithm there are a
          few key differences.
        </div>
        <ol>
          <li>
            (Dijkstra Step 3) Instead of searching for the lowest g-score in the
            open set, we now look for the lowest f-score in the open set in
            order to includes the hueristic.
          </li>
          <li>
            (Dijkstra Step 4) If the neighbor node is in the open set, once we
            find the lower g-score, we then have the recalculate the f-score by
            adding the lower g-score with the h -score. The h-score can be
            calculated by finding the euclidean distance between the neighbor
            node and the end node.
          </li>
        </ol>
        <div className={"astar-paragraph-2"}>
          With these two changes, the A* algorithm finishes when either the open
          set is empty or the end node is reached.
        </div>
      </div>
    </>
  );
};

export default AStarText;
