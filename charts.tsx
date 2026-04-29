import { defineComponent, onMounted, ref, watch, onUnmounted } from 'vue';
import * as d3 from 'd3';

export const PriceChart = defineComponent({
  props: {
    data: { required: true }
  },
  setup(props: { data: number[] }) {
    const containerRef = ref<HTMLDivElement | null>(null);
    const svgRef = ref<SVGSVGElement | null>(null);

    const drawChart = (newData: number[]) => {
      if (!svgRef.value || !newData || newData.length < 2) return;
      
      const container = containerRef.value;
      const width = container?.clientWidth || 800;
      const height = 200;
      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Clear previous chart
      const svgEl = d3.select(svgRef.value);
      svgEl.selectAll('*').remove();
      
      svgEl
        .attr('width', width)
        .attr('height', height);

      const g = svgEl.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Calculate proper domain from actual data
      const validData = newData.filter((d): d is number => typeof d === 'number' && !isNaN(d));
      if (validData.length < 2) return;

      const x = d3.scaleLinear()
        .domain([0, validData.length - 1])
        .range([0, innerWidth]);

      const yMin = Math.min(...validData);
      const yMax = Math.max(...validData);
      const yPadding = (yMax - yMin) * 0.1 || 1000; // Add 10% padding or minimum 1000
      
      const y = d3.scaleLinear()
        .domain([yMin - yPadding, yMax + yPadding])
        .range([innerHeight, 0]);

      // Add gradient - append to svgEl, not the null svg variable
      const gradient = svgEl.append('defs')
        .append('linearGradient')
        .attr('id', 'areaGradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#38bdf8')
        .attr('stop-opacity', 0.3);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#38bdf8')
        .attr('stop-opacity', 0);

      // Area under the line
      const area = d3.area<number>()
        .x((_: number, i: number) => x(i))
        .y0(innerHeight)
        .y1((d: number) => y(d))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(validData)
        .attr('fill', 'url(#areaGradient)')
        .attr('d', area);

      // Line
      const line = d3.line<number>()
        .x((_: number, i: number) => x(i))
        .y((d: number) => y(d))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(validData)
        .attr('fill', 'none')
        .attr('stroke', '#38bdf8')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Add dots
      g.selectAll('.dot')
        .data(validData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (_: number, i: number) => x(i))
        .attr('cy', (d: number) => y(d))
        .attr('r', 3)
        .attr('fill', '#38bdf8')
        .attr('opacity', 0);

      // X axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(() => ''))
        .attr('color', '#334155')
        .selectAll('line')
        .attr('stroke', '#334155');

      // Y axis - show full numbers without SI prefix
      g.append('g')
        .call(d3.axisLeft(y).ticks(6).tickFormat((d: unknown) => `$${d3.format(',')(d as number)}`))
        .attr('color', '#334155')
        .selectAll('text')
        .attr('fill', '#94a3b8')
        .style('font-size', '11px');

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickFormat(() => ''))
        .attr('stroke', '#334155')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', '3,3')
        .selectAll('line')
        .attr('stroke', '#334155');
    };

    onMounted(() => {
      // Initial draw with a small delay to ensure DOM is ready
      setTimeout(() => drawChart(props.data), 0);
      
      // Watch for data changes - use a computed to track length
      watch(() => props.data.length, () => {
        drawChart(props.data);
      });

      // Handle resize
      const handleResize = () => {
        if (props.data.length > 1) {
          drawChart(props.data);
        }
      };
      window.addEventListener('resize', handleResize);
      
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });
    });

    return () => (
      <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
        <svg ref={svgRef}></svg>
      </div>
    );
  }
});