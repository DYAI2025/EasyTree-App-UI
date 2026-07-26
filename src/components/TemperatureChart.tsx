import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Thermometer, Clock, Sparkles } from 'lucide-react';

export interface HourlyTempData {
  hour: number;
  timeLabel: string;
  temp: number;
  isWorkHour?: boolean;
}

export const default24hTodayData: HourlyTempData[] = [
  { hour: 0, timeLabel: '00:00', temp: 16.5 },
  { hour: 1, timeLabel: '01:00', temp: 16.0 },
  { hour: 2, timeLabel: '02:00', temp: 15.5 },
  { hour: 3, timeLabel: '03:00', temp: 15.2 },
  { hour: 4, timeLabel: '04:00', temp: 15.0 },
  { hour: 5, timeLabel: '05:00', temp: 15.5 },
  { hour: 6, timeLabel: '06:00', temp: 16.8 },
  { hour: 7, timeLabel: '07:00', temp: 18.2 },
  { hour: 8, timeLabel: '08:00', temp: 20.0, isWorkHour: true },
  { hour: 9, timeLabel: '09:00', temp: 21.5, isWorkHour: true },
  { hour: 10, timeLabel: '10:00', temp: 22.8, isWorkHour: true },
  { hour: 11, timeLabel: '11:00', temp: 23.9, isWorkHour: true },
  { hour: 12, timeLabel: '12:00', temp: 24.8, isWorkHour: true },
  { hour: 13, timeLabel: '13:00', temp: 25.2, isWorkHour: true },
  { hour: 14, timeLabel: '14:00', temp: 25.0, isWorkHour: true },
  { hour: 15, timeLabel: '15:00', temp: 24.3, isWorkHour: true },
  { hour: 16, timeLabel: '16:00', temp: 23.5 },
  { hour: 17, timeLabel: '17:00', temp: 22.4 },
  { hour: 18, timeLabel: '18:00', temp: 21.0 },
  { hour: 19, timeLabel: '19:00', temp: 19.8 },
  { hour: 20, timeLabel: '20:00', temp: 18.5 },
  { hour: 21, timeLabel: '21:00', temp: 17.6 },
  { hour: 22, timeLabel: '22:00', temp: 16.9 },
  { hour: 23, timeLabel: '23:00', temp: 16.2 }
];

interface TemperatureChartProps {
  data?: HourlyTempData[];
  title?: string;
  subtitle?: string;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data = default24hTodayData,
  title = '24-Stunden Temperaturverlauf (Heute)',
  subtitle = 'Stündliche Prognose mit hervorgehobener Einsatzzeit'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HourlyTempData | null>(null);

  // Compute summary stats
  const minTempPoint = data.reduce((min, p) => (p.temp < min.temp ? p : min), data[0]);
  const maxTempPoint = data.reduce((max, p) => (p.temp > max.temp ? p : max), data[0]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    // Dimensions
    const containerWidth = containerRef.current.clientWidth || 340;
    const height = 190;
    const margin = { top: 25, right: 15, bottom: 30, left: 35 };
    const width = containerWidth;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 23])
      .range([0, innerWidth]);

    const yMin = Math.floor(d3.min(data, (d) => d.temp) || 10) - 2;
    const yMax = Math.ceil(d3.max(data, (d) => d.temp) || 30) + 2;

    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    // Main Chart Group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Definitions (Gradients)
    const defs = svg.append('defs');

    // Wood-Amber Gradient for Area
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'woodAmberGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#D6A875')
      .attr('stop-opacity', 0.45);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#D6A875')
      .attr('stop-opacity', 0.0);

    // Work Hour Highlight Band (08:00 to 15:30 -> hour 8 to 15.5)
    const workStart = 8;
    const workEnd = 15.5;
    const bandX1 = xScale(workStart);
    const bandX2 = xScale(workEnd);

    // Render Work Hour Shaded Rectangle
    g.append('rect')
      .attr('x', bandX1)
      .attr('y', 0)
      .attr('width', Math.max(0, bandX2 - bandX1))
      .attr('height', innerHeight)
      .attr('fill', '#55735B')
      .attr('fill-opacity', 0.15)
      .attr('stroke', '#55735B')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '2,2')
      .attr('rx', 4);

    // Label on Top of Work Hour Band
    g.append('text')
      .attr('x', bandX1 + (bandX2 - bandX1) / 2)
      .attr('y', -8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#7D8B55')
      .attr('font-size', '9px')
      .attr('font-weight', '700')
      .attr('font-family', 'monospace')
      .text('Einsatzzeit (08:00–15:30)');

    // Grid Lines (Horizontal)
    const yTicks = yScale.ticks(4);
    yTicks.forEach((tickVal) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(tickVal))
        .attr('y2', yScale(tickVal))
        .attr('stroke', '#34332D')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    });

    // Area Generator
    const area = d3
      .area<HourlyTempData>()
      .x((d) => xScale(d.hour))
      .y0(innerHeight)
      .y1((d) => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#woodAmberGradient)')
      .attr('d', area);

    // Line Generator
    const line = d3
      .line<HourlyTempData>()
      .x((d) => xScale(d.hour))
      .y((d) => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    // Draw Wood-Amber Line Path
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#D6A875') // Wood-amber path color
      .attr('stroke-width', 2.8)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    // X-Axis Time Ticks
    const xHourLabels = [0, 4, 8, 12, 16, 20, 23];
    xHourLabels.forEach((hourVal) => {
      const xPos = xScale(hourVal);
      g.append('text')
        .attr('x', xPos)
        .attr('y', innerHeight + 18)
        .attr('text-anchor', hourVal === 23 ? 'end' : hourVal === 0 ? 'start' : 'middle')
        .attr('fill', '#918577')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`${hourVal.toString().padStart(2, '0')}:00`);
    });

    // Y-Axis Temperature Labels
    yTicks.forEach((tickVal) => {
      g.append('text')
        .attr('x', -8)
        .attr('y', yScale(tickVal) + 3)
        .attr('text-anchor', 'end')
        .attr('fill', '#918577')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`${Math.round(tickVal)}°`);
    });

    // Min and Max Highlight Dots on Chart
    [minTempPoint, maxTempPoint].forEach((pt) => {
      const isMax = pt === maxTempPoint;
      g.append('circle')
        .attr('cx', xScale(pt.hour))
        .attr('cy', yScale(pt.temp))
        .attr('r', 4)
        .attr('fill', isMax ? '#C48A4A' : '#5B7E86')
        .attr('stroke', '#1C201C')
        .attr('stroke-width', 2);
    });

    // Hover & Interactive Crosshair Elements
    const crosshair = g
      .append('line')
      .attr('stroke', '#D6A875')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    const focusPoint = g
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#D6A875')
      .attr('stroke', '#141713')
      .attr('stroke-width', 2.5)
      .style('opacity', 0);

    // Overlay Rect for Pointer Interaction
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    const handlePointerMove = (event: any) => {
      const [pointerX] = d3.pointer(event);
      const hourVal = Math.max(0, Math.min(23, Math.round(xScale.invert(pointerX))));
      const point = data.find((d) => d.hour === hourVal) || data[0];

      setHoveredPoint(point);

      crosshair
        .attr('x1', xScale(point.hour))
        .attr('x2', xScale(point.hour))
        .style('opacity', 1);

      focusPoint
        .attr('cx', xScale(point.hour))
        .attr('cy', yScale(point.temp))
        .style('opacity', 1);
    };

    const handlePointerLeave = () => {
      setHoveredPoint(null);
      crosshair.style('opacity', 0);
      focusPoint.style('opacity', 0);
    };

    overlay
      .on('mousemove touchmove', handlePointerMove)
      .on('mouseleave touchend', handlePointerLeave);
  }, [data]);

  return (
    <div className="bg-[#1C201C] p-4 rounded-2xl border border-[#34332D] space-y-3 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#272822] text-[#D6A875] rounded-lg border border-[#34332D]">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-[#918577]">{subtitle}</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#D6A875] bg-[#49372B]/60 px-2 py-0.5 rounded border border-[#D6A875]/40 font-bold">
          D3.js
        </span>
      </div>

      {/* Temperature Quick Summary Pills */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-[#141713] p-2 rounded-xl border border-[#34332D] text-center">
          <span className="text-[9px] text-[#918577] block uppercase font-sans">Min. Nacht</span>
          <span className="text-[#5B7E86] font-extrabold">{minTempPoint.temp}°C</span>
          <span className="text-[9px] text-[#918577] block">({minTempPoint.timeLabel})</span>
        </div>

        <div className="bg-[#141713] p-2 rounded-xl border border-[#34332D] text-center">
          <span className="text-[9px] text-[#918577] block uppercase font-sans">Max. Nachmittag</span>
          <span className="text-[#C48A4A] font-extrabold">{maxTempPoint.temp}°C</span>
          <span className="text-[9px] text-[#918577] block">({maxTempPoint.timeLabel})</span>
        </div>

        <div className="bg-[#141713] p-2 rounded-xl border border-[#34332D] text-center">
          <span className="text-[9px] text-[#918577] block uppercase font-sans">Ø Einsatzzeit</span>
          <span className="text-[#D6A875] font-extrabold">23.2°C</span>
          <span className="text-[9px] text-[#7D8B55] block font-sans font-bold">Optimal</span>
        </div>
      </div>

      {/* Interactive Tooltip Card on Hover */}
      <div className="min-h-[28px] flex items-center justify-between bg-[#141713] px-3 py-1.5 rounded-xl border border-[#34332D] text-xs font-mono">
        {hoveredPoint ? (
          <>
            <span className="text-[#918577] flex items-center gap-1 font-sans">
              <Clock className="w-3.5 h-3.5 text-[#D6A875]" />
              Uhrzeit: <strong className="text-[#F1E8DC] font-mono">{hoveredPoint.timeLabel} Uhr</strong>
            </span>
            <span className="text-[#D6A875] font-bold">
              {hoveredPoint.temp}°C
              {hoveredPoint.isWorkHour && (
                <span className="ml-1.5 text-[9px] bg-[#55735B] text-[#F1E8DC] px-1 py-0.2 rounded font-sans uppercase">
                  Einsatz
                </span>
              )}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-[#918577] italic font-sans flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D6A875]" />
            Tippe/Fahre über das Diagramm für stündliche Details
          </span>
        )}
      </div>

      {/* SVG Container for D3 Chart */}
      <div ref={containerRef} className="w-full pt-1">
        <svg ref={svgRef} className="w-full h-auto block select-none" />
      </div>
    </div>
  );
};
