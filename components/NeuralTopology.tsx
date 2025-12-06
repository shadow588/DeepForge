import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  isActive?: boolean;
}

const NeuralTopology: React.FC<Props> = ({ isActive = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !isActive) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#ffffff");

    // Generate random nodes
    const numNodes = 45;
    const nodes = Array.from({ length: numNodes }, (_, i) => ({
      id: i,
      r: Math.random() * 4 + 2,
      group: Math.floor(Math.random() * 3)
    }));

    // Create links
    const links: { source: number; target: number }[] = [];
    for (let i = 0; i < numNodes; i++) {
      const target = Math.floor(Math.random() * numNodes);
      if (target !== i) {
        links.push({ source: i, target });
      }
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(90))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15));

    // Lines are faint gray
    const link = svg.append("g")
      .attr("stroke", "#e4e4e7")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    // Nodes are black/dark gray
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.r)
      .attr("fill", "#18181b")
      .call(d3.drag<any, any>()
        .on("start", (event: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event: any) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", (event: any) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
      );

    node.append("title")
      .text((d) => `Node ${d.id}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [isActive]);

  return (
    <div className="w-full flex justify-center">
      <div
        ref={containerRef}
        className="max-w-xl w-full h-[600px] border border-border rounded-xl overflow-hidden relative bg-white"
      >
        <svg ref={svgRef} className="w-full h-full cursor-move"></svg>
      </div>
    </div>
  );
};

export default NeuralTopology;
