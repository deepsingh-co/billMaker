import { useEffect, useRef, useState } from "react";
import { ChartColumn, TrendingUp } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatShortDate,
} from "../../lib/format";

function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => setWidth(element.getBoundingClientRect().width);
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

function niceMax(value) {
  if (!Number.isFinite(value) || value <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  let nice = 10;
  if (normalized <= 1) nice = 1;
  else if (normalized <= 2) nice = 2;
  else if (normalized <= 5) nice = 5;
  return nice * magnitude;
}

export default function RevenueChart({ daily = [], days, loading, summary }) {
  const [containerRef, width] = useElementWidth();
  const [activeIndex, setActiveIndex] = useState(null);

  const data = Array.isArray(daily) ? daily : [];
  const rangeRevenue = data.reduce(
    (sum, item) => sum + (Number(item.revenue) || 0),
    0
  );
  const hasSales = rangeRevenue > 0;
  const height = width > 0 && width < 520 ? 218 : 300;

  let chart = null;

  if (width > 0 && data.length > 0 && hasSales) {
    const padding = {
      top: 18,
      right: 14,
      bottom: 32,
      left: width < 520 ? 44 : 62,
    };
    const innerWidth = Math.max(width - padding.left - padding.right, 10);
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = niceMax(
      Math.max(...data.map((item) => Number(item.revenue) || 0))
    );
    const pointCount = data.length;
    const xFor = (index) =>
      pointCount <= 1
        ? padding.left + innerWidth / 2
        : padding.left + (index / (pointCount - 1)) * innerWidth;
    const yFor = (value) =>
      padding.top + innerHeight - (Number(value) / maxValue) * innerHeight;

    const points = data.map((item, index) => ({
      x: xFor(index),
      y: yFor(item.revenue),
      ...item,
    }));

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${
      padding.top + innerHeight
    } L ${points[0].x} ${padding.top + innerHeight} Z`;

    const tickCount = width < 520 ? 4 : 5;
    const tickValues = Array.from(
      { length: tickCount },
      (_, index) => (maxValue / (tickCount - 1)) * index
    );
    const labelStep = Math.max(
      1,
      Math.ceil(pointCount / (width < 520 ? 4 : 7))
    );
    const activePoint = activeIndex === null ? null : points[activeIndex];

    const handlePointerMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width) * width;
      let closest = 0;
      let shortest = Number.POSITIVE_INFINITY;
      points.forEach((point, index) => {
        const distance = Math.abs(point.x - pointerX);
        if (distance < shortest) {
          shortest = distance;
          closest = index;
        }
      });
      setActiveIndex(closest);
    };

    chart = (
      <div className="relative mt-2" ref={containerRef}>
        {activePoint ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[115%] whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100}%`,
            }}
          >
            <p className="font-medium text-slate-300">
              {formatShortDate(activePoint.date)}
            </p>
            <p className="tabular mt-0.5 font-semibold">
              {formatCurrency(activePoint.revenue)}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {activePoint.bills} {activePoint.bills === 1 ? "bill" : "bills"}
            </p>
          </div>
        ) : null}

        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Daily revenue for the last ${days} days`}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {tickValues.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 6"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500"
                  fontSize={width < 520 ? 9 : 11}
                  fontFamily="Fira Code, monospace"
                >
                  {formatCompactCurrency(tick)}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            if (index % labelStep !== 0 && index !== points.length - 1) {
              return null;
            }
            return (
              <text
                key={`label-${point.date}`}
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize={width < 520 ? 9 : 11}
              >
                {formatShortDate(point.date)}
              </text>
            );
          })}

          <path d={areaPath} fill="url(#revenueFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r={activeIndex === index ? 5 : 3}
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <rect
                x={point.x - 12}
                y={padding.top}
                width="24"
                height={innerHeight}
                fill="transparent"
              />
            </g>
          ))}
        </svg>

        <table className="sr-only">
          <caption>Daily revenue for the selected period</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Revenue</th>
              <th scope="col">Bills</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{item.bills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    chart = (
      <div ref={containerRef}>
        {loading || (hasSales && width === 0) ? (
          <Skeleton className="mt-4 h-[278px] w-full" />
        ) : (
          <EmptyState
            icon={ChartColumn}
            title="No sales in this period"
            description="Generate an invoice from the point of sale and the revenue trend will appear here."
          />
        )}
      </div>
    );
  }

  return (
    <section
      aria-labelledby="revenue-chart-title"
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="revenue-chart-title"
              className="text-base font-semibold text-slate-900"
            >
              Revenue trend
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Daily revenue across the last {days} days
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Range revenue
          </p>
          <p className="tabular mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {loading && data.length === 0 ? "—" : formatCurrency(rangeRevenue)}
          </p>
        </div>
      </div>
      {chart}

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Bills in range</p>
          <p className="tabular mt-1 text-sm font-semibold text-slate-900">
            {loading && !summary ? "—" : formatNumber(summary?.bills || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Items sold</p>
          <p className="tabular mt-1 text-sm font-semibold text-slate-900">
            {loading && !summary ? "—" : formatNumber(summary?.itemsSold || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Average bill</p>
          <p className="tabular mt-1 text-sm font-semibold text-slate-900">
            {loading && !summary ? "—" : formatCurrency(summary?.avgBill || 0)}
          </p>
        </div>
      </div>
    </section>
  );
}
