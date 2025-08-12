"use client"
import { Button } from "./ui/button"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { BarChart3, Download, Filter, RefreshCw } from "lucide-react"

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-blue-400" />
          Analytics & Reports
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  )
}
