"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, ChartOptions, Filler } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, Filler)

interface PriceData {
  prices: [number, number][]
  total_volumes: [number, number][]
}

const timeRanges = ['1d', '3d', '1w', '1m', '6m', '1y', 'max']
const menuItems = ['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings']

export default function FinancialChart() {
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [percentageChange, setPercentageChange] = useState<number>(0)
  const [chartData, setChartData] = useState<PriceData>({ prices: [], total_volumes: [] })
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('1w')
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('Chart')
  const chartRef = useRef<ChartJS>(null)
  const volumeChartRef = useRef<ChartJS>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const fetchPriceData = async (days: number) => {
    try {
      const response = await axios.get<PriceData>(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
      )
      setChartData(response.data)
      
      if (response.data.prices.length > 0) {
        const latestPrice = response.data.prices[response.data.prices.length - 1][1]
        const yesterdayPrice = response.data.prices[response.data.prices.length - 2][1]
        setCurrentPrice(latestPrice)
        setPriceChange(latestPrice - yesterdayPrice)
        setPercentageChange(((latestPrice - yesterdayPrice) / yesterdayPrice) * 100)
      }
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
  }

  useEffect(() => {
    const days = timeRanges.indexOf(selectedTimeRange) + 1
    fetchPriceData(days)
  }, [selectedTimeRange])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 80,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM dd, yyyy',
        },
        adapters: {
          date: {
            locale: enUS,
          },
        },
        grid: {
          display: true,
          color: 'rgba(234, 236, 239, 0.5)',
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(234, 236, 239, 0.5)',
          drawTicks: false,
          display: false, // Changed from true to false
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        position: 'nearest',
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
      filler: {
        propagate: true
      },
      crosshair: {},
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
  }

  const volumeOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 80,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM dd, yyyy',
        },
        adapters: {
          date: {
            locale: enUS,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
  }

  const data = {
    labels: chartData.prices.map(price => new Date(price[0])),
    datasets: [
      {
        type: 'line' as const,
        label: 'Price',
        data: chartData.prices.map(price => price[1]),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
          return gradient;
        },
        fill: true,
        yAxisID: 'y',
      },
    ],
  }

  const volumeData = {
    labels: chartData.total_volumes.map(volume => new Date(volume[0])),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Volume',
        data: chartData.total_volumes.map(volume => volume[1]),
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        barThickness: 2,
      },
    ],
  }

  const toggleFullscreen = () => {
    if (chartContainerRef.current) {
      if (!document.fullscreenElement) {
        chartContainerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: (chart: ChartJS, args: any, options: any) => {
      if (chart.tooltip?.getActiveElements()?.length) {
        const activePoint = chart.tooltip.getActiveElements()[0];
        const { ctx } = chart;
        const { x } = activePoint.element;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;

        // Draw vertical line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.stroke();

        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(xAxis.left, activePoint.element.y);
        ctx.lineTo(xAxis.right, activePoint.element.y);
        ctx.stroke();

        // Draw price tooltip on y-scale
        const price = activePoint.element.$context.raw;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(xAxis.right + 5, activePoint.element.y - 12, 70, 24, 4);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '12px Circular Std';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`$${price.toFixed(2)}`, xAxis.right + 40, activePoint.element.y);

        ctx.restore();
      }
    }
  };

  const drawCurrentPriceIndicator = (chart: ChartJS) => {
    const { ctx } = chart;
    const yAxis = chart.scales.y;
    const xAxis = chart.scales.x;
    const currentPricePixel = yAxis.getPixelForValue(currentPrice);

    ctx.save();
    ctx.fillStyle = 'rgb(59, 130, 246)';
    ctx.beginPath();
    ctx.roundRect(xAxis.right + 5, currentPricePixel - 12, 70, 24, 4);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '12px Circular Std';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${currentPrice.toFixed(2)}`, xAxis.right + 40, currentPricePixel);
    ctx.restore();
  };


  useEffect(() => {
    const chart = chartRef.current

    if (chart && chart.canvas) {
      const originalDraw = chart.draw
      chart.draw = function () {
        originalDraw.apply(this, arguments as any)
        drawCurrentPriceIndicator(this)
      }
    }
  }, [chartData, currentPrice])

  return (
    <div className="w-[800px] h-[600px] mx-auto p-6 bg-white rounded-lg shadow-lg font-['Circular_Std']">
      <div className="mb-8">
        <h2 className="text-[50px] font-light leading-[88.56px] text-[#1E2329]">
          {currentPrice.toLocaleString()}{" "}
          <sup className="text-[30px] font-normal text-[#58667E]">USD</sup>
        </h2>
        <div
          className={`text-lg ${
            priceChange >= 0 ? "text-[#03A66D]" : "text-[#CF304A]"
          }`}
        >
          {priceChange >= 0 ? "+" : "-"}$
          {Math.abs(priceChange).toLocaleString()} (
          {percentageChange.toFixed(2)}%)
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`pb-3 ${
                selectedMenuItem === item
                  ? "text-[#1E2329] border-b-2 border-[#1E2329]"
                  : "text-[#707A8A]"
              }`}
              onClick={() => setSelectedMenuItem(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={toggleFullscreen}
          className="text-[#707A8A] hover:text-[#1E2329] flex items-center"
          aria-label="Fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          <span className="ml-2">Fullscreen</span>
        </button>

        <button
          className="text-[#707A8A] hover:text-[#1E2329] flex items-center"
          aria-label="Compare"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="ml-2">Compare</span>
        </button>
        {timeRanges.map((range) => (
          <button
            key={range}
            className={`px-3 py-1 rounded ${
              selectedTimeRange === range
                ? "bg-[#3861FB] text-white"
                : "text-[#707A8A] "
            }`}
            onClick={() => setSelectedTimeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      <div
        ref={chartContainerRef}
        className="relative cursor-crosshair"
        style={{ height: "400px" }}
      >
        <div style={{ height: "70%" }}>
          <Chart
            ref={chartRef as any}
            type="line"
            data={data}
            options={options}
            plugins={[crosshairPlugin]}
          />
        </div>
        <div style={{ height: "20%", marginTop: "-80px" }}>
          <Chart
            ref={volumeChartRef as any}
            type="bar"
            data={volumeData}
            options={volumeOptions}
          />
        </div>
      </div>
    </div>
  )
}