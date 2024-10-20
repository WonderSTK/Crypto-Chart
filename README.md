# Crypto Chart Application

This is a Crypto chart application built with [Next.js](https://nextjs.org), [React](https://reactjs.org), and [Chart.js](https://www.chartjs.org). The application fetches and displays Bitcoin price data from the CoinGecko API, providing various interactive features such as tooltips, crosshairs, and a fullscreen toggle.

## Features

- **Interactive Line and Bar Charts**: Displays Bitcoin price and volume data using `react-chartjs-2` and `Chart.js`.
- **Dynamic Data Fetching**: Fetches real-time data from the CoinGecko API based on the selected time range.
- **Custom Plugins**: Implements custom plugins for crosshairs and price tooltips.
- **Responsive Design**: Ensures charts and UI elements are responsive and adapt to different screen sizes.
- **Fullscreen Mode**: Allows users to toggle fullscreen mode for a better viewing experience.
- **Navigation Menu**: Provides a navigation menu to switch between different views such as Summary, Chart, Statistics, Analysis, and Settings.

## Tech Stack

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Chart.js**: A JavaScript library for creating charts.
- **react-chartjs-2**: A React wrapper for Chart.js.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Axios**: A promise-based HTTP client for making API requests.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.


## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:


git clone https://github.com/WonderSTK/Crypto-chart.git
cd Crypto-chart

2. Install dependencies:
npm install
# or
yarn install

Running the Development Server
Start the development server:
npm run dev
# or
yarn dev


Open http://localhost:3000 with your browser to see the result.

Building for Production
To create an optimized production build:

npm run build
# or
yarn build

Running Tests
To run tests using Jest:

npm run test
# or
yarn test

## Usage

### FinancialChart Component

The `FinancialChart` component is the main component that displays the financial chart. It fetches data from the CoinGecko API and renders line and bar charts using `react-chartjs-2`.

#### Props

- `selectedTimeRange`: The selected time range for fetching data (e.g., '1d', '1w', '1m').
- `selectedMenuItem`: The selected menu item (e.g., 'Summary', 'Chart').

#### State

- `currentPrice`: The current price of Bitcoin.
- `priceChange`: The change in price from the previous day.
- `percentageChange`: The percentage change in price from the previous day.
- `chartData`: The fetched price data.
- `volumeData`: The fetched volume data.

#### Methods

- `fetchPriceData(days: number)`: Fetches price data from the CoinGecko API.
- `toggleFullscreen()`: Toggles fullscreen mode for the chart container.
- `drawCurrentPriceIndicator(chart: ChartJS)`: Draws an indicator for the current price on the chart.
- `crosshairPlugin`: A custom plugin for drawing crosshairs and price tooltips on the chart.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

